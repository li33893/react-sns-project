const express = require('express');
const router = express.Router();
const db = require("../db");
const authMiddleware = require("../auth");

// =====================================================
// 路线相关 API
// =====================================================

// 创建路线（队长创建队伍时先创建路线）
router.post("/route", authMiddleware, async (req, res) => {
    let { 
        routeName, district, startLocation, endLocation, 
        totalDistance, estimatedTime, intensityLevel, avgPace, 
        description, segments, createdBy 
    } = req.body;

    // 验证必填字段
    if (!routeName || !district || !startLocation || !endLocation || !totalDistance || !estimatedTime || !segments || segments.length === 0) {
        return res.status(400).json({ 
            result: "fail", 
            msg: "필수 항목을 입력해주세요 (routeName, district, startLocation, endLocation, totalDistance, estimatedTime, segments)" 
        });
    }

    try {
        // 1. 插入路线基本信息
        let routeSql = `
            INSERT INTO TBL_ROUTE 
            (routeName, district, startLocation, endLocation, totalDistance, estimatedTime, 
             segmentCount, intensityLevel, avgPace, description, createdBy, cdatetime, udatetime)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
        `;
        
        let [routeResult] = await db.query(routeSql, [
            routeName, district, startLocation, endLocation, totalDistance, estimatedTime,
            segments.length, intensityLevel || 'intermediate', avgPace || null, 
            description || null, createdBy
        ]);

        let routeId = routeResult.insertId;

        // 2. 插入每个分段
        for (let i = 0; i < segments.length; i++) {
            let seg = segments[i];
            let segmentSql = `
                INSERT INTO TBL_ROUTE_SEGMENT
                (routeId, segmentOrder, segmentName, startPoint, endPoint, 
                 segmentDistance, estimatedTime, maxTime, cdatetime, udatetime)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
            `;
            
            await db.query(segmentSql, [
                routeId,
                i + 1, // segmentOrder
                seg.segmentName || `제${i + 1}구간`,
                seg.startPoint,
                seg.endPoint,
                seg.segmentDistance,
                seg.estimatedTime,
                seg.maxTime || seg.estimatedTime + 2 // 默认最大时间 = 预计时间 + 2分钟
            ]);
        }

        res.json({ 
            result: "success", 
            routeId: routeId,
            msg: "경로가 생성되었습니다" 
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ 
            result: "fail", 
            msg: "경로 생성 실패", 
            error: error.message 
        });
    }
});

// 获取路线详情（包括所有分段）
router.get("/route/:routeId", async (req, res) => {
    let { routeId } = req.params;

    try {
        // 获取路线基本信息
        let routeSql = "SELECT * FROM TBL_ROUTE WHERE routeId = ?";
        let [routeList] = await db.query(routeSql, [routeId]);

        if (routeList.length === 0) {
            return res.status(404).json({ result: "fail", msg: "경로를 찾을 수 없습니다" });
        }

        let route = routeList[0];

        // 获取所有分段
        let segmentSql = "SELECT * FROM TBL_ROUTE_SEGMENT WHERE routeId = ? ORDER BY segmentOrder ASC";
        let [segments] = await db.query(segmentSql, [routeId]);

        res.json({
            result: "success",
            route: {
                ...route,
                segments: segments
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ result: "fail", msg: "경로 조회 실패" });
    }
});

// =====================================================
// 队伍相关 API
// =====================================================

// 创建队伍
router.post("/", authMiddleware, async (req, res) => {
    let { 
        groupName, routeId, leaderId, district, 
        scheduleType, weekDays, startTime, description 
    } = req.body;

    if (!groupName || !routeId || !leaderId || !district || !startTime) {
        return res.status(400).json({ 
            result: "fail", 
            msg: "필수 항목을 입력해주세요" 
        });
    }

    try {
        // 1. 验证队长的完成率是否 >= 90%
        let [leaderInfo] = await db.query(
            "SELECT completionRate FROM users_tbl WHERE userId = ?", 
            [leaderId]
        );

        if (leaderInfo.length === 0) {
            return res.status(404).json({ result: "fail", msg: "사용자를 찾을 수 없습니다" });
        }

        if (leaderInfo[0].completionRate < 90.0) {
            return res.status(403).json({ 
                result: "fail", 
                msg: "팀장이 되려면 완료율이 90% 이상이어야 합니다" 
            });
        }

        // 2. 获取路线信息（确定最大人数）
        let [routeInfo] = await db.query(
            "SELECT segmentCount FROM TBL_ROUTE WHERE routeId = ?", 
            [routeId]
        );

        if (routeInfo.length === 0) {
            return res.status(404).json({ result: "fail", msg: "경로를 찾을 수 없습니다" });
        }

        let maxMembers = routeInfo[0].segmentCount;

        // 3. 创建队伍
        let groupSql = `
            INSERT INTO TBL_GROUP
            (groupName, routeId, leaderId, district, scheduleType, weekDays, 
             startTime, maxMembers, currentMembers, status, description, cdatetime, udatetime)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, 'recruiting', ?, NOW(), NOW())
        `;

        let [groupResult] = await db.query(groupSql, [
            groupName, routeId, leaderId, district, 
            scheduleType || 'weekly', 
            weekDays ? JSON.stringify(weekDays) : null,
            startTime, maxMembers, description || null
        ]);

        let groupId = groupResult.insertId;

        // 4. 队长自动成为第一个成员（负责第1段）
        let [firstSegment] = await db.query(
            "SELECT segmentId FROM TBL_ROUTE_SEGMENT WHERE routeId = ? ORDER BY segmentOrder ASC LIMIT 1",
            [routeId]
        );

        await db.query(
            `INSERT INTO TBL_GROUP_MEMBER 
             (groupId, userId, role, assignedSegmentId, joinedAt, cdatetime, udatetime)
             VALUES (?, ?, 'leader', ?, NOW(), NOW(), NOW())`,
            [groupId, leaderId, firstSegment[0].segmentId]
        );

        // 5. 自动创建队伍群聊
        let [chatRoomResult] = await db.query(
            `INSERT INTO TBL_CHAT_ROOM (roomType, roomName, relatedGroupId, cdatetime, udatetime)
             VALUES ('group', ?, ?, NOW(), NOW())`,
            [groupName + ' 그룹채팅', groupId]
        );

        let roomId = chatRoomResult.insertId;

        // 6. 队长加入群聊
        await db.query(
            `INSERT INTO TBL_CHAT_MEMBER (roomId, userId, joinedAt, cdatetime)
             VALUES (?, ?, NOW(), NOW())`,
            [roomId, leaderId]
        );

        res.json({ 
            result: "success", 
            groupId: groupId,
            roomId: roomId,
            msg: "팀이 생성되었습니다" 
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ 
            result: "fail", 
            msg: "팀 생성 실패", 
            error: error.message 
        });
    }
});

// 获取队伍列表（带筛选和搜索）
router.get("/", async (req, res) => {
    let { district, startTime, intensityLevel, status, search } = req.query;

    try {
        let sql = `
            SELECT 
                G.*, 
                R.routeName, R.totalDistance, R.estimatedTime, R.intensityLevel, R.avgPace,
                R.startLocation, R.endLocation,
                U.nickname as leaderNickname, U.profileImg as leaderProfileImg,
                (SELECT COUNT(*) FROM TBL_GROUP_MEMBER WHERE groupId = G.groupId) as memberCount
            FROM TBL_GROUP G
            LEFT JOIN TBL_ROUTE R ON G.routeId = R.routeId
            LEFT JOIN users_tbl U ON G.leaderId = U.userId
            WHERE 1=1
        `;

        let params = [];

        // 按地区筛选
        if (district) {
            sql += " AND G.district = ?";
            params.push(district);
        }

        // 按时间段筛选（简化版：按小时范围）
        if (startTime) {
            sql += " AND HOUR(G.startTime) BETWEEN ? AND ?";
            let hour = parseInt(startTime);
            params.push(hour, hour + 2);
        }

        // 按强度筛选
        if (intensityLevel) {
            sql += " AND R.intensityLevel = ?";
            params.push(intensityLevel);
        }

        // 按状态筛选
        if (status) {
            sql += " AND G.status = ?";
            params.push(status);
        } else {
            // 默认只显示招募中的队伍
            sql += " AND G.status = 'recruiting'";
        }

        // 搜索功能
        if (search && search.trim()) {
            sql += " AND (G.groupName LIKE ? OR R.routeName LIKE ? OR G.district LIKE ?)";
            let searchPattern = `%${search.trim()}%`;
            params.push(searchPattern, searchPattern, searchPattern);
        }

        sql += " ORDER BY G.cdatetime DESC";

        let [groups] = await db.query(sql, params);

        res.json({ result: "success", groups: groups });
    } catch (error) {
        console.log(error);
        res.status(500).json({ result: "fail", msg: "팀 목록 조회 실패" });
    }
});

// 获取队伍详情
router.get("/:groupId", async (req, res) => {
    let { groupId } = req.params;
    let { userId } = req.query; // 当前用户ID，用于判断是否已申请

    try {
        // 1. 获取队伍基本信息
        let groupSql = `
            SELECT 
                G.*, 
                R.routeName, R.totalDistance, R.estimatedTime, R.intensityLevel, R.avgPace,
                R.startLocation, R.endLocation, R.description as routeDescription,
                U.nickname as leaderNickname, U.profileImg as leaderProfileImg, U.userId as leaderId
            FROM TBL_GROUP G
            LEFT JOIN TBL_ROUTE R ON G.routeId = R.routeId
            LEFT JOIN users_tbl U ON G.leaderId = U.userId
            WHERE G.groupId = ?
        `;
        let [groupList] = await db.query(groupSql, [groupId]);

        if (groupList.length === 0) {
            return res.status(404).json({ result: "fail", msg: "팀을 찾을 수 없습니다" });
        }

        let group = groupList[0];

        // 2. 获取所有分段信息
        let segmentSql = `
            SELECT 
                S.*,
                M.userId, M.role,
                U.nickname, U.profileImg
            FROM TBL_ROUTE_SEGMENT S
            LEFT JOIN TBL_GROUP_MEMBER M ON S.segmentId = M.assignedSegmentId AND M.groupId = ?
            LEFT JOIN users_tbl U ON M.userId = U.userId
            WHERE S.routeId = ?
            ORDER BY S.segmentOrder ASC
        `;
        let [segments] = await db.query(segmentSql, [groupId, group.routeId]);

        // 3. 获取所有成员
        let memberSql = `
            SELECT 
                M.*, 
                U.nickname, U.profileImg,
                S.segmentName, S.segmentOrder
            FROM TBL_GROUP_MEMBER M
            LEFT JOIN users_tbl U ON M.userId = U.userId
            LEFT JOIN TBL_ROUTE_SEGMENT S ON M.assignedSegmentId = S.segmentId
            WHERE M.groupId = ?
            ORDER BY S.segmentOrder ASC
        `;
        let [members] = await db.query(memberSql, [groupId]);

        // 4. 检查当前用户是否已申请或已是成员
        let userStatus = { isMember: false, isLeader: false, hasApplied: false, applicationStatus: null };
        
        if (userId) {
            // 检查是否是成员
            let memberCheck = members.find(m => m.userId === userId);
            if (memberCheck) {
                userStatus.isMember = true;
                userStatus.isLeader = memberCheck.role === 'leader';
            }

            // 检查是否有待审核的申请
            let [applications] = await db.query(
                "SELECT status FROM TBL_GROUP_APPLICATION WHERE groupId = ? AND userId = ? ORDER BY cdatetime DESC LIMIT 1",
                [groupId, userId]
            );
            if (applications.length > 0) {
                userStatus.hasApplied = true;
                userStatus.applicationStatus = applications[0].status;
            }
        }

        res.json({
            result: "success",
            group: {
                ...group,
                segments: segments,
                members: members,
                userStatus: userStatus
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ result: "fail", msg: "팀 정보 조회 실패" });
    }
});

// =====================================================
// 申请加入队伍
// =====================================================

router.post("/:groupId/apply", authMiddleware, async (req, res) => {
    let { groupId } = req.params;
    let { userId, preferredSegmentId, healthInfo, occupation, applicationReason } = req.body;

    if (!userId || !preferredSegmentId || !healthInfo || !applicationReason) {
        return res.status(400).json({ 
            result: "fail", 
            msg: "필수 항목을 입력해주세요" 
        });
    }

    try {
        // 1. 检查是否已是成员
        let [existingMember] = await db.query(
            "SELECT * FROM TBL_GROUP_MEMBER WHERE groupId = ? AND userId = ?",
            [groupId, userId]
        );

        if (existingMember.length > 0) {
            return res.status(400).json({ result: "fail", msg: "이미 팀 멤버입니다" });
        }

        // 2. 检查是否有待审核的申请
        let [pendingApplication] = await db.query(
            "SELECT * FROM TBL_GROUP_APPLICATION WHERE groupId = ? AND userId = ? AND status = 'pending'",
            [groupId, userId]
        );

        if (pendingApplication.length > 0) {
            return res.status(400).json({ result: "fail", msg: "이미 신청서가 제출되었습니다" });
        }

        // 3. 检查该分段是否已满
        let [segmentMembers] = await db.query(
            "SELECT COUNT(*) as count FROM TBL_GROUP_MEMBER WHERE groupId = ? AND assignedSegmentId = ?",
            [groupId, preferredSegmentId]
        );

        if (segmentMembers[0].count >= 1) {
            return res.status(400).json({ 
                result: "fail", 
                msg: "해당 구간은 이미 배정되었습니다. 다른 구간을 선택해주세요" 
            });
        }

        // 4. 提交申请
        let applySql = `
            INSERT INTO TBL_GROUP_APPLICATION
            (groupId, userId, preferredSegmentId, healthInfo, occupation, applicationReason, 
             status, cdatetime, udatetime)
            VALUES (?, ?, ?, ?, ?, ?, 'pending', NOW(), NOW())
        `;

        let [result] = await db.query(applySql, [
            groupId, userId, preferredSegmentId, healthInfo, 
            occupation || null, applicationReason
        ]);

        // 5. 通知队长
        let [groupInfo] = await db.query(
            "SELECT leaderId, groupName FROM TBL_GROUP WHERE groupId = ?",
            [groupId]
        );

        let [applicantInfo] = await db.query(
            "SELECT nickname FROM users_tbl WHERE userId = ?",
            [userId]
        );

        await db.query(
            `INSERT INTO TBL_NOTIFICATION
             (userId, notificationType, relatedType, relatedId, fromUserId, fromUserNickname, 
              content, isRead, cdatetime, udatetime)
             VALUES (?, 'app_approved', 'group', ?, ?, ?, ?, FALSE, NOW(), NOW())`,
            [
                groupInfo[0].leaderId,
                groupId,
                userId,
                applicantInfo[0]?.nickname || userId,
                `${groupInfo[0].groupName} 팀에 새로운 신청이 있습니다`
            ]
        );

        res.json({ 
            result: "success", 
            applicationId: result.insertId,
            msg: "신청서가 제출되었습니다" 
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ result: "fail", msg: "신청 실패", error: error.message });
    }
});

// 获取队伍的所有申请（队长查看）
router.get("/:groupId/applications", authMiddleware, async (req, res) => {
    let { groupId } = req.params;
    let { leaderId } = req.query; // 验证是否是队长

    try {
        // 验证是否是队长
        let [groupInfo] = await db.query(
            "SELECT leaderId FROM TBL_GROUP WHERE groupId = ?",
            [groupId]
        );

        if (groupInfo.length === 0) {
            return res.status(404).json({ result: "fail", msg: "팀을 찾을 수 없습니다" });
        }

        if (groupInfo[0].leaderId !== leaderId) {
            return res.status(403).json({ result: "fail", msg: "권한이 없습니다" });
        }

        // 获取所有申请
        let sql = `
            SELECT 
                A.*,
                U.nickname, U.profileImg, U.addr, U.comorbidity,
                S.segmentName, S.segmentOrder
            FROM TBL_GROUP_APPLICATION A
            LEFT JOIN users_tbl U ON A.userId = U.userId
            LEFT JOIN TBL_ROUTE_SEGMENT S ON A.preferredSegmentId = S.segmentId
            WHERE A.groupId = ?
            ORDER BY A.status ASC, A.cdatetime DESC
        `;

        let [applications] = await db.query(sql, [groupId]);

        res.json({ result: "success", applications: applications });
    } catch (error) {
        console.log(error);
        res.status(500).json({ result: "fail", msg: "신청 목록 조회 실패" });
    }
});

// 审核申请（通过/拒绝）
router.put("/application/:applicationId", authMiddleware, async (req, res) => {
    let { applicationId } = req.params;
    let { reviewerId, status, rejectionReason, assignedSegmentId } = req.body;

    if (!reviewerId || !status || (status !== 'approved' && status !== 'rejected')) {
        return res.status(400).json({ 
            result: "fail", 
            msg: "필수 항목을 입력해주세요 (reviewerId, status)" 
        });
    }

    if (status === 'rejected' && !rejectionReason) {
        return res.status(400).json({ 
            result: "fail", 
            msg: "거절 사유를 입력해주세요" 
        });
    }

    try {
        // 1. 获取申请信息
        let [application] = await db.query(
            "SELECT * FROM TBL_GROUP_APPLICATION WHERE applicationId = ?",
            [applicationId]
        );

        if (application.length === 0) {
            return res.status(404).json({ result: "fail", msg: "신청서를 찾을 수 없습니다" });
        }

        let app = application[0];

        // 2. 验证是否是队长
        let [groupInfo] = await db.query(
            "SELECT leaderId, groupName FROM TBL_GROUP WHERE groupId = ?",
            [app.groupId]
        );

        if (groupInfo[0].leaderId !== reviewerId) {
            return res.status(403).json({ result: "fail", msg: "권한이 없습니다" });
        }

        // 3. 更新申请状态
        await db.query(
            `UPDATE TBL_GROUP_APPLICATION 
             SET status = ?, reviewedBy = ?, rejectionReason = ?, reviewedAt = NOW(), udatetime = NOW()
             WHERE applicationId = ?`,
            [status, reviewerId, rejectionReason || null, applicationId]
        );

        // 4. 如果通过，添加成员
        if (status === 'approved') {
            let segmentId = assignedSegmentId || app.preferredSegmentId;

            // 检查该分段是否已被分配
            let [segmentCheck] = await db.query(
                "SELECT COUNT(*) as count FROM TBL_GROUP_MEMBER WHERE groupId = ? AND assignedSegmentId = ?",
                [app.groupId, segmentId]
            );

            if (segmentCheck[0].count >= 1) {
                return res.status(400).json({ 
                    result: "fail", 
                    msg: "해당 구간은 이미 배정되었습니다" 
                });
            }

            // 添加成员
            await db.query(
                `INSERT INTO TBL_GROUP_MEMBER
                 (groupId, userId, role, assignedSegmentId, joinedAt, cdatetime, udatetime)
                 VALUES (?, ?, 'member', ?, NOW(), NOW(), NOW())`,
                [app.groupId, app.userId, segmentId]
            );

            // 更新队伍人数
            await db.query(
                "UPDATE TBL_GROUP SET currentMembers = currentMembers + 1, udatetime = NOW() WHERE groupId = ?",
                [app.groupId]
            );

            // 检查是否已满，更新状态
            let [memberCount] = await db.query(
                "SELECT currentMembers, maxMembers FROM TBL_GROUP WHERE groupId = ?",
                [app.groupId]
            );

            if (memberCount[0].currentMembers >= memberCount[0].maxMembers) {
                await db.query(
                    "UPDATE TBL_GROUP SET status = 'full', udatetime = NOW() WHERE groupId = ?",
                    [app.groupId]
                );
            }

            // 将用户加入群聊
            let [chatRoom] = await db.query(
                "SELECT roomId FROM TBL_CHAT_ROOM WHERE relatedGroupId = ?",
                [app.groupId]
            );

            if (chatRoom.length > 0) {
                await db.query(
                    "INSERT INTO TBL_CHAT_MEMBER (roomId, userId, joinedAt, cdatetime) VALUES (?, ?, NOW(), NOW())",
                    [chatRoom[0].roomId, app.userId]
                );
            }

            // 通知申请人 - 通过
            await db.query(
                `INSERT INTO TBL_NOTIFICATION
                 (userId, notificationType, relatedType, relatedId, content, isRead, cdatetime, udatetime)
                 VALUES (?, 'app_approved', 'group', ?, ?, FALSE, NOW(), NOW())`,
                [app.userId, app.groupId, `${groupInfo[0].groupName} 팀 가입이 승인되었습니다`]
            );
        } else {
            // 通知申请人 - 拒绝
            await db.query(
                `INSERT INTO TBL_NOTIFICATION
                 (userId, notificationType, relatedType, relatedId, content, isRead, cdatetime, udatetime)
                 VALUES (?, 'app_rejected', 'group', ?, ?, FALSE, NOW(), NOW())`,
                [app.userId, app.groupId, `${groupInfo[0].groupName} 팀 가입이 거절되었습니다: ${rejectionReason}`]
            );
        }

        res.json({ 
            result: "success", 
            msg: status === 'approved' ? "승인되었습니다" : "거절되었습니다" 
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ result: "fail", msg: "심사 실패", error: error.message });
    }
});

// =====================================================
// 接力活动相关 API
// =====================================================

// 开始活动（队长或任何成员）
router.post("/:groupId/activity/start", authMiddleware, async (req, res) => {
    let { groupId } = req.params;
    let { userId } = req.body;

    try {
        // 1. 检查是否是队伍成员
        let [memberCheck] = await db.query(
            "SELECT * FROM TBL_GROUP_MEMBER WHERE groupId = ? AND userId = ?",
            [groupId, userId]
        );

        if (memberCheck.length === 0) {
            return res.status(403).json({ result: "fail", msg: "팀 멤버만 활동을 시작할 수 있습니다" });
        }

        // 2. 检查是否已有进行中的活动
        let [ongoingActivity] = await db.query(
            "SELECT * FROM TBL_ACTIVITY_HISTORY WHERE groupId = ? AND status = 'ongoing'",
            [groupId]
        );

        if (ongoingActivity.length > 0) {
            return res.status(400).json({ 
                result: "fail", 
                msg: "이미 진행 중인 활동이 있습니다",
                activityId: ongoingActivity[0].activityId
            });
        }

        // 3. 获取队伍和路线信息
        let [groupInfo] = await db.query(
            "SELECT G.*, R.routeId FROM TBL_GROUP G LEFT JOIN TBL_ROUTE R ON G.routeId = R.routeId WHERE G.groupId = ?",
            [groupId]
        );

        if (groupInfo.length === 0) {
            return res.status(404).json({ result: "fail", msg: "팀을 찾을 수 없습니다" });
        }

        let group = groupInfo[0];

        // 4. 创建活动记录
        let activitySql = `
            INSERT INTO TBL_ACTIVITY_HISTORY
            (groupId, routeId, scheduledDate, scheduledTime, actualStartTime, status, participantCount, cdatetime, udatetime)
            VALUES (?, ?, CURDATE(), ?, NOW(), 'ongoing', 0, NOW(), NOW())
        `;

        let [activityResult] = await db.query(activitySql, [groupId, group.routeId, group.startTime]);
        let activityId = activityResult.insertId;

        // 5. 获取所有成员和他们负责的分段
        let membersSql = `
            SELECT M.userId, M.assignedSegmentId, S.segmentOrder
            FROM TBL_GROUP_MEMBER M
            LEFT JOIN TBL_ROUTE_SEGMENT S ON M.assignedSegmentId = S.segmentId
            WHERE M.groupId = ?
            ORDER BY S.segmentOrder ASC
        `;
        let [members] = await db.query(membersSql, [groupId]);

        // 6. 为每个成员创建分段记录
        for (let i = 0; i < members.length; i++) {
            let member = members[i];
            let relayFrom = i > 0 ? members[i - 1].userId : null;

            await db.query(
                `INSERT INTO TBL_ACTIVITY_SEGMENT_RECORD
                 (activityId, segmentId, userId, relayFrom, status, cdatetime, udatetime)
                 VALUES (?, ?, ?, ?, 'waiting', NOW(), NOW())`,
                [activityId, member.assignedSegmentId, member.userId, relayFrom]
            );
        }

        // 7. 将第一个人（队长）的状态设为 'running'
        let firstMember = members[0];
        await db.query(
            `UPDATE TBL_ACTIVITY_SEGMENT_RECORD 
             SET status = 'running', actualStartTime = NOW(), udatetime = NOW()
             WHERE activityId = ? AND segmentId = ?`,
            [activityId, firstMember.assignedSegmentId]
        );

        // 8. 更新参与人数
        await db.query(
            "UPDATE TBL_ACTIVITY_HISTORY SET participantCount = ?, udatetime = NOW() WHERE activityId = ?",
            [members.length, activityId]
        );

        res.json({ 
            result: "success", 
            activityId: activityId,
            msg: "활동이 시작되었습니다" 
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ result: "fail", msg: "활동 시작 실패", error: error.message });
    }
});

// 获取当前进行中的活动详情
router.get("/:groupId/activity/current", async (req, res) => {
    let { groupId } = req.params;
    let { userId } = req.query;

    try {
        // 1. 获取进行中的活动
        let [activity] = await db.query(
            "SELECT * FROM TBL_ACTIVITY_HISTORY WHERE groupId = ? AND status = 'ongoing' ORDER BY cdatetime DESC LIMIT 1",
            [groupId]
        );

        if (activity.length === 0) {
            return res.json({ result: "success", activity: null, msg: "진행 중인 활동이 없습니다" });
        }

        let activityInfo = activity[0];

        // 2. 获取所有分段记录
        let recordsSql = `
            SELECT 
                R.*,
                S.segmentName, S.segmentOrder, S.startPoint, S.endPoint, S.estimatedTime, S.maxTime,
                U.nickname, U.profileImg
            FROM TBL_ACTIVITY_SEGMENT_RECORD R
            LEFT JOIN TBL_ROUTE_SEGMENT S ON R.segmentId = S.segmentId
            LEFT JOIN users_tbl U ON R.userId = U.userId
            WHERE R.activityId = ?
            ORDER BY S.segmentOrder ASC
        `;
        let [records] = await db.query(recordsSql, [activityInfo.activityId]);

        // 3. 找出当前正在跑的人
        let currentRunner = records.find(r => r.status === 'running');

        // 4. 检查当前用户的状态
        let userStatus = {
            isParticipant: false,
            isCurrentRunner: false,
            hasCompleted: false,
            canRelay: false
        };

        if (userId) {
            let userRecord = records.find(r => r.userId === userId);
            if (userRecord) {
                userStatus.isParticipant = true;
                userStatus.isCurrentRunner = userRecord.status === 'running';
                userStatus.hasCompleted = userRecord.status === 'completed';
                userStatus.canRelay = userRecord.status === 'running';
            }
        }

        // 5. 获取队长信息（用于跳过权限判断）
        let [groupInfo] = await db.query(
            "SELECT leaderId FROM TBL_GROUP WHERE groupId = ?",
            [groupId]
        );
        
        let isLeader = userId === groupInfo[0]?.leaderId;

        res.json({
            result: "success",
            activity: {
                ...activityInfo,
                records: records,
                currentRunner: currentRunner,
                userStatus: userStatus,
                isLeader: isLeader
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ result: "fail", msg: "활동 정보 조회 실패" });
    }
});

// 接力（传递给下一个人）
router.post("/activity/:activityId/relay", authMiddleware, async (req, res) => {
    let { activityId } = req.params;
    let { userId } = req.body;

    try {
        // 1. 检查当前用户是否正在跑
        let [currentRecord] = await db.query(
            "SELECT * FROM TBL_ACTIVITY_SEGMENT_RECORD WHERE activityId = ? AND userId = ? AND status = 'running'",
            [activityId, userId]
        );

        if (currentRecord.length === 0) {
            return res.status(403).json({ result: "fail", msg: "현재 달리고 있지 않습니다" });
        }

        let record = currentRecord[0];

        // 2. 计算实际用时
        let startTime = new Date(record.actualStartTime);
        let endTime = new Date();
        let duration = Math.round((endTime - startTime) / 1000 / 60); // 分钟

        // 3. 获取分段信息，判断是否超时
        let [segment] = await db.query(
            "SELECT maxTime FROM TBL_ROUTE_SEGMENT WHERE segmentId = ?",
            [record.segmentId]
        );

        let isOnTime = duration <= segment[0].maxTime;
        let newStatus = isOnTime ? 'completed' : 'overtime';

        // 4. 更新当前记录
        await db.query(
            `UPDATE TBL_ACTIVITY_SEGMENT_RECORD 
             SET status = ?, actualEndTime = NOW(), actualDuration = ?, isOnTime = ?, udatetime = NOW()
             WHERE recordId = ?`,
            [newStatus, duration, isOnTime, record.recordId]
        );

        // 5. 查找下一个人
        let [allRecords] = await db.query(
            `SELECT R.*, S.segmentOrder 
             FROM TBL_ACTIVITY_SEGMENT_RECORD R
             LEFT JOIN TBL_ROUTE_SEGMENT S ON R.segmentId = S.segmentId
             WHERE R.activityId = ?
             ORDER BY S.segmentOrder ASC`,
            [activityId]
        );

        let currentIndex = allRecords.findIndex(r => r.recordId === record.recordId);
        let nextRunner = allRecords[currentIndex + 1];

        if (nextRunner) {
            // 6. 启动下一个人
            await db.query(
                `UPDATE TBL_ACTIVITY_SEGMENT_RECORD 
                 SET status = 'running', actualStartTime = NOW(), udatetime = NOW()
                 WHERE recordId = ?`,
                [nextRunner.recordId]
            );

            res.json({ 
                result: "success", 
                msg: "다음 주자에게 릴레이했습니다",
                nextRunner: nextRunner.userId,
                isOnTime: isOnTime
            });
        } else {
            // 7. 这是最后一个人，活动结束
            await db.query(
                `UPDATE TBL_ACTIVITY_HISTORY 
                 SET status = 'completed', actualEndTime = NOW(), udatetime = NOW()
                 WHERE activityId = ?`,
                [activityId]
            );

            // 8. 更新所有成员的完成率
            let completedRecords = allRecords.filter(r => r.status === 'completed' || r.status === 'overtime');
            
            for (let r of completedRecords) {
                await db.query(
                    `UPDATE TBL_GROUP_MEMBER 
                     SET totalActivities = totalActivities + 1, 
                         completedActivities = completedActivities + 1,
                         completionRate = (completedActivities + 1) * 100.0 / (totalActivities + 1),
                         udatetime = NOW()
                     WHERE groupId = (SELECT groupId FROM TBL_ACTIVITY_HISTORY WHERE activityId = ?) AND userId = ?`,
                    [activityId, r.userId]
                );

                // 更新用户总完成率
                await db.query(
                    `UPDATE users_tbl 
                     SET completionRate = (
                         SELECT AVG(completionRate) FROM TBL_GROUP_MEMBER WHERE userId = ?
                     ), udatetime = NOW()
                     WHERE userId = ?`,
                    [r.userId, r.userId]
                );
            }

            res.json({ 
                result: "success", 
                msg: "활동이 완료되었습니다!",
                isCompleted: true
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ result: "fail", msg: "릴레이 실패", error: error.message });
    }
});

// 跳过某人（队长权限）
router.post("/activity/:activityId/skip", authMiddleware, async (req, res) => {
    let { activityId } = req.params;
    let { userId, skipUserId } = req.body; // userId是操作者（队长），skipUserId是被跳过的人

    try {
        // 1. 验证是否是队长
        let [activity] = await db.query(
            "SELECT groupId FROM TBL_ACTIVITY_HISTORY WHERE activityId = ?",
            [activityId]
        );

        let [groupInfo] = await db.query(
            "SELECT leaderId FROM TBL_GROUP WHERE groupId = ?",
            [activity[0].groupId]
        );

        if (groupInfo[0].leaderId !== userId) {
            return res.status(403).json({ result: "fail", msg: "팀장만 스킵할 수 있습니다" });
        }

        // 2. 将被跳过的人状态设为 'skipped'
        await db.query(
            `UPDATE TBL_ACTIVITY_SEGMENT_RECORD 
             SET status = 'skipped', udatetime = NOW()
             WHERE activityId = ? AND userId = ?`,
            [activityId, skipUserId]
        );

        // 3. 查找下一个人
        let [allRecords] = await db.query(
            `SELECT R.*, S.segmentOrder 
             FROM TBL_ACTIVITY_SEGMENT_RECORD R
             LEFT JOIN TBL_ROUTE_SEGMENT S ON R.segmentId = S.segmentId
             WHERE R.activityId = ?
             ORDER BY S.segmentOrder ASC`,
            [activityId]
        );

        let skippedIndex = allRecords.findIndex(r => r.userId === skipUserId);
        let nextRunner = allRecords[skippedIndex + 1];

        if (nextRunner && nextRunner.status === 'waiting') {
            // 4. 启动下一个人
            await db.query(
                `UPDATE TBL_ACTIVITY_SEGMENT_RECORD 
                 SET status = 'running', actualStartTime = NOW(), udatetime = NOW()
                 WHERE recordId = ?`,
                [nextRunner.recordId]
            );
        }

        res.json({ 
            result: "success", 
            msg: `${skipUserId}님을 스킵했습니다`,
            nextRunner: nextRunner?.userId
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ result: "fail", msg: "스킵 실패", error: error.message });
    }
});

// 取消活动（队长）
router.post("/activity/:activityId/cancel", authMiddleware, async (req, res) => {
    let { activityId } = req.params;
    let { userId } = req.body;

    try {
        // 1. 验证是否是队长
        let [activity] = await db.query(
            "SELECT groupId FROM TBL_ACTIVITY_HISTORY WHERE activityId = ?",
            [activityId]
        );

        let [groupInfo] = await db.query(
            "SELECT leaderId FROM TBL_GROUP WHERE groupId = ?",
            [activity[0].groupId]
        );

        if (groupInfo[0].leaderId !== userId) {
            return res.status(403).json({ result: "fail", msg: "팀장만 취소할 수 있습니다" });
        }

        // 2. 更新活动状态
        await db.query(
            "UPDATE TBL_ACTIVITY_HISTORY SET status = 'cancelled', udatetime = NOW() WHERE activityId = ?",
            [activityId]
        );

        res.json({ result: "success", msg: "활동이 취소되었습니다" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ result: "fail", msg: "취소 실패" });
    }
});

module.exports = router;