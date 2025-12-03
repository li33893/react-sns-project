const express = require('express');
const router = express.Router();
const db = require("../db");
const authMiddleware = require("../auth");
const multer = require('multer');

// 图片上传配置
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/chat/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// ============ 聊天室相关 ============

// 获取用户的所有聊天室列表
router.get("/rooms", authMiddleware, async (req, res) => {
    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({ msg: "userId is required" });
    }

    try {
        const sql = `
            SELECT 
                R.roomId,
                R.roomType,
                R.roomName,
                R.relatedGroupId,
                R.cdatetime,

                -- 未读消息数
                (
                    SELECT COUNT(*) 
                    FROM tbl_chat_message M
                    WHERE M.roomId = R.roomId
                    AND M.cdatetime > COALESCE(CM.lastReadAt, '1970-01-01')
                    AND M.senderId != ?
                ) AS unreadCount,

                -- 最后一条消息
                (
                    SELECT content 
                    FROM tbl_chat_message 
                    WHERE roomId = R.roomId 
                    ORDER BY cdatetime DESC 
                    LIMIT 1
                ) AS lastMessage,

                -- 最后一条消息时间
                (
                    SELECT cdatetime 
                    FROM tbl_chat_message 
                    WHERE roomId = R.roomId 
                    ORDER BY cdatetime DESC 
                    LIMIT 1
                ) AS lastMessageTime,

                G.groupName,
                G.district,

                -- ⭐ 只对私聊获取对方信息（使用子查询避免重复）
                CASE 
                    WHEN R.roomType = 'private' THEN (
                        SELECT U2.userId
                        FROM tbl_chat_member CM2
                        JOIN users_tbl U2 ON CM2.userId = U2.userId
                        WHERE CM2.roomId = R.roomId AND CM2.userId != ?
                        LIMIT 1
                    )
                    ELSE NULL
                END AS otherUserId,
                
                CASE 
                    WHEN R.roomType = 'private' THEN (
                        SELECT U2.nickname
                        FROM tbl_chat_member CM2
                        JOIN users_tbl U2 ON CM2.userId = U2.userId
                        WHERE CM2.roomId = R.roomId AND CM2.userId != ?
                        LIMIT 1
                    )
                    ELSE NULL
                END AS otherUserNickname,
                
                CASE 
                    WHEN R.roomType = 'private' THEN (
                        SELECT U2.profileImg
                        FROM tbl_chat_member CM2
                        JOIN users_tbl U2 ON CM2.userId = U2.userId
                        WHERE CM2.roomId = R.roomId AND CM2.userId != ?
                        LIMIT 1
                    )
                    ELSE NULL
                END AS otherUserProfileImg

            FROM tbl_chat_room R

            INNER JOIN tbl_chat_member CM 
                ON R.roomId = CM.roomId AND CM.userId = ?

            LEFT JOIN tbl_group G 
                ON R.relatedGroupId = G.groupId

            ORDER BY lastMessageTime DESC, R.cdatetime DESC
        `;

        const [rooms] = await db.query(sql, [
            userId,  // unreadCount
            userId,  // otherUserId
            userId,  // otherUserNickname  
            userId,  // otherUserProfileImg
            userId   // CM.userId
        ]);

        res.json({
            rooms,
            result: "success"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Failed to get chat rooms" });
    }
});

// 获取特定聊天室详情
router.get("/rooms/:roomId", authMiddleware, async (req, res) => {
    const { roomId } = req.params;
    const { userId } = req.query;

    try {
        // 验证用户是否在此聊天室
        const [membership] = await db.query(
            "SELECT * FROM tbl_chat_member WHERE roomId = ? AND userId = ?",
            [roomId, userId]
        );

        if (membership.length === 0) {
            return res.status(403).json({ msg: "접근 권한이 없습니다" });
        }

        // 获取聊天室信息
        const [roomInfo] = await db.query(`
            SELECT 
                R.*,
                G.groupName,
                G.district
            FROM tbl_chat_room R
            LEFT JOIN tbl_group G ON R.relatedGroupId = G.groupId
            WHERE R.roomId = ?
        `, [roomId]);

        // 获取成员列表
        const [members] = await db.query(`
            SELECT 
                CM.userId,
                U.nickname,
                U.profileImg,
                CM.joinedAt
            FROM tbl_chat_member CM
            JOIN users_tbl U ON CM.userId = U.userId
            WHERE CM.roomId = ?
            ORDER BY CM.joinedAt
        `, [roomId]);

        res.json({
            room: roomInfo[0],
            members,
            result: "success"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Failed to get room details" });
    }
});

// 创建私聊房间
router.post("/rooms/private", authMiddleware, async (req, res) => {
    const { userId1, userId2 } = req.body;

    if (!userId1 || !userId2) {
        return res.status(400).json({ msg: "Both userIds are required" });
    }

    try {
        // 检查是否已存在私聊
        const checkSql = `
            SELECT R.roomId 
            FROM tbl_chat_room R
            INNER JOIN tbl_chat_member CM1 ON R.roomId = CM1.roomId
            INNER JOIN tbl_chat_member CM2 ON R.roomId = CM2.roomId
            WHERE R.roomType = 'private'
            AND CM1.userId = ?
            AND CM2.userId = ?
            AND (SELECT COUNT(*) FROM tbl_chat_member WHERE roomId = R.roomId) = 2
        `;

        const [existing] = await db.query(checkSql, [userId1, userId2]);

        if (existing.length > 0) {
            return res.json({
                roomId: existing[0].roomId,
                msg: "기존 채팅방을 불러왔습니다",
                result: "success"
            });
        }

        // 创建新私聊房间
        const [roomResult] = await db.query(
            "INSERT INTO tbl_chat_room (roomType, cdatetime, udatetime) VALUES ('private', NOW(), NOW())"
        );

        const roomId = roomResult.insertId;

        // 添加两个成员
        await db.query(
            "INSERT INTO tbl_chat_member (roomId, userId, joinedAt, cdatetime) VALUES (?, ?, NOW(), NOW()), (?, ?, NOW(), NOW())",
            [roomId, userId1, roomId, userId2]
        );

        res.json({
            roomId,
            msg: "채팅방이 생성되었습니다",
            result: "success"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Failed to create private chat" });
    }
});

// ============ 消息相关 ============

// 获取聊天室消息列表
router.get("/rooms/:roomId/messages", authMiddleware, async (req, res) => {
    const { roomId } = req.params;
    const { userId, limit = 50, before } = req.query;

    try {
        // 验证权限
        const [membership] = await db.query(
            "SELECT * FROM tbl_chat_member WHERE roomId = ? AND userId = ?",
            [roomId, userId]
        );

        if (membership.length === 0) {
            return res.status(403).json({ msg: "접근 권한이 없습니다" });
        }

        let sql = `
            SELECT 
                M.messageId,
                M.senderId,
                M.messageType,
                M.content,
                M.cdatetime,
                U.nickname,
                U.profileImg
            FROM tbl_chat_message M
            LEFT JOIN users_tbl U ON M.senderId = U.userId
            WHERE M.roomId = ?
        `;

        const params = [roomId];

        if (before) {
            sql += " AND M.cdatetime < ?";
            params.push(before);
        }

        sql += " ORDER BY M.cdatetime DESC LIMIT ?";
        params.push(parseInt(limit));

        const [messages] = await db.query(sql, params);

        res.json({
            messages: messages.reverse(),
            result: "success"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Failed to get messages" });
    }
});

// 发送文字消息
router.post("/rooms/:roomId/messages", authMiddleware, async (req, res) => {
    const { roomId } = req.params;
    const { senderId, content } = req.body;

    if (!content || !content.trim()) {
        return res.status(400).json({ msg: "메시지 내용이 필요합니다" });
    }

    try {
        // 验证权限
        const [membership] = await db.query(
            "SELECT * FROM tbl_chat_member WHERE roomId = ? AND userId = ?",
            [roomId, senderId]
        );

        if (membership.length === 0) {
            return res.status(403).json({ msg: "채팅방 멤버가 아닙니다" });
        }

        const [result] = await db.query(
            `INSERT INTO tbl_chat_message (roomId, senderId, messageType, content, cdatetime) 
             VALUES (?, ?, 'text', ?, NOW())`,
            [roomId, senderId, content]
        );

        // 获取完整消息信息
        const [messages] = await db.query(`
            SELECT 
                M.messageId,
                M.senderId,
                M.messageType,
                M.content,
                M.cdatetime,
                U.nickname,
                U.profileImg
            FROM tbl_chat_message M
            LEFT JOIN users_tbl U ON M.senderId = U.userId
            WHERE M.messageId = ?
        `, [result.insertId]);

        res.json({
            message: messages[0],
            msg: "메시지 전송 성공",
            result: "success"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Failed to send message" });
    }
});

// 发送图片消息
router.post("/rooms/:roomId/messages/image", authMiddleware, upload.single('image'), async (req, res) => {
    const { roomId } = req.params;
    const { senderId } = req.body;
    const file = req.file;

    console.log('==================== 图片上传开始 ====================');
    console.log('📷 roomId:', roomId);
    console.log('📷 senderId:', senderId);
    console.log('📷 file:', file ? file.filename : 'NO FILE');

    if (!file) {
        return res.status(400).json({ msg: "이미지가 필요합니다" });
    }

    try {
        const [membership] = await db.query(
            "SELECT * FROM tbl_chat_member WHERE roomId = ? AND userId = ?",
            [roomId, senderId]
        );

        if (membership.length === 0) {
            return res.status(403).json({ msg: "채팅방 멤버가 아닙니다" });
        }

        const host = `${req.protocol}://${req.get("host")}/`;
        const imageUrl = host + file.path.replace(/\\/g, '/');
        console.log('🖼️ 图片 URL:', imageUrl);

        const [result] = await db.query(
            `INSERT INTO tbl_chat_message (roomId, senderId, messageType, content, cdatetime) 
             VALUES (?, ?, 'image', ?, NOW())`,
            [roomId, senderId, imageUrl]
        );

        console.log('✅ 数据库插入成功，messageId:', result.insertId);

        const [messages] = await db.query(`
            SELECT 
                M.messageId,
                M.senderId,
                M.messageType,
                M.content,
                M.cdatetime,
                U.nickname,
                U.profileImg
            FROM tbl_chat_message M
            LEFT JOIN users_tbl U ON M.senderId = U.userId
            WHERE M.messageId = ?
        `, [result.insertId]);

        const newMessage = messages[0];
        console.log('📦 完整消息:', JSON.stringify(newMessage, null, 2));

        // 获取 io 实例
        const io = req.app.get('io');
        console.log('🔌 io 是否存在:', io ? 'YES ✅' : 'NO ❌');

        if (io) {
            const roomName = `room_${roomId}`;
            console.log('📡 广播到房间:', roomName);
            io.to(roomName).emit('new_message', newMessage);
            console.log('✅ 广播完成');
        } else {
            console.error('❌❌❌ IO 不存在！检查 server.js 中的 app.set("io", io)');
        }

        console.log('==================== 图片上传结束 ====================\n');

        res.json({
            message: newMessage,
            msg: "이미지 전송 성공",
            result: "success"
        });
    } catch (error) {
        console.error('❌ 图片上传失败:', error);
        res.status(500).json({ msg: "Failed to send image" });
    }
});

// 更新最后阅读时间
// 更新最后阅读时间
router.put("/rooms/:roomId/read", authMiddleware, async (req, res) => {
    const { roomId } = req.params;  // 从 URL 参数获取
    const { userId } = req.body;    // 从请求体获取

    // 验证参数
    if (!roomId || !userId) {
        console.error('❌ Missing parameters:', { roomId, userId });
        return res.status(400).json({
            msg: "roomId와 userId가 필요합니다",
            result: "error"
        });
    }

    // 验证 roomId 是数字
    if (isNaN(parseInt(roomId))) {
        console.error('❌ Invalid roomId:', roomId);
        return res.status(400).json({
            msg: "유효하지 않은 roomId입니다",
            result: "error"
        });
    }

    try {
        // 验证用户是否在此聊天室
        const [membership] = await db.query(
            "SELECT * FROM tbl_chat_member WHERE roomId = ? AND userId = ?",
            [parseInt(roomId), userId]
        );

        if (membership.length === 0) {
            return res.status(403).json({
                msg: "채팅방 멤버가 아닙니다",
                result: "error"
            });
        }

        // 更新已读时间
        await db.query(
            "UPDATE tbl_chat_member SET lastReadAt = NOW() WHERE roomId = ? AND userId = ?",
            [parseInt(roomId), userId]
        );

        res.json({
            msg: "읽음 상태 업데이트",
            result: "success"
        });
    } catch (error) {
        console.error('❌ Failed to mark as read:', error);
        res.status(500).json({
            msg: "읽음 상태 업데이트 실패",
            result: "error",
            error: error.message
        });
    }
});

// 获取未读消息总数
router.get("/unread-count", authMiddleware, async (req, res) => {
    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({ msg: "userId is required" });
    }

    try {
        const sql = `
            SELECT SUM(unreadCount) as totalUnread
            FROM (
                SELECT 
                    (SELECT COUNT(*) FROM tbl_chat_message M 
                     WHERE M.roomId = R.roomId 
                     AND M.cdatetime > COALESCE(CM.lastReadAt, '1970-01-01')
                     AND M.senderId != ?) as unreadCount
                FROM tbl_chat_room R
                INNER JOIN tbl_chat_member CM ON R.roomId = CM.roomId
                WHERE CM.userId = ?
            ) as counts
        `;

        const [[result]] = await db.query(sql, [userId, userId]);

        res.json({
            count: result.totalUnread || 0,
            result: "success"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Failed to get unread count" });
    }
});

// 退出聊天室（只能退出私聊，群聊需要特殊处理）
router.delete("/rooms/:roomId/leave", authMiddleware, async (req, res) => {
    const { roomId } = req.params;
    const { userId } = req.body;

    try {
        // 检查房间类型
        const [room] = await db.query("SELECT roomType FROM tbl_chat_room WHERE roomId = ?", [roomId]);

        if (room.length === 0) {
            return res.status(404).json({ msg: "채팅방을 찾을 수 없습니다" });
        }

        if (room[0].roomType === 'group') {
            return res.status(400).json({ msg: "그룹 채팅방은 나갈 수 없습니다" });
        }

        await db.query("DELETE FROM tbl_chat_member WHERE roomId = ? AND userId = ?", [roomId, userId]);

        res.json({
            msg: "채팅방을 나갔습니다",
            result: "success"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Failed to leave room" });
    }
});


// 在 message.js 中添加以下路由

// ============ 搜索功能 ============

// 搜索用户（用于创建私聊）
router.get("/search/users", authMiddleware, async (req, res) => {
    const { query, currentUserId } = req.query;

    if (!query || query.trim().length < 1) {
        return res.json({ users: [], result: "success" });
    }

    try {
        const searchPattern = `%${query.trim()}%`;
        
        const sql = `
            SELECT 
                U.userId,
                U.nickname,
                U.profileImg,
                U.addr,
                -- 检查是否已有私聊
                (
                    SELECT R.roomId 
                    FROM tbl_chat_room R
                    INNER JOIN tbl_chat_member CM1 ON R.roomId = CM1.roomId
                    INNER JOIN tbl_chat_member CM2 ON R.roomId = CM2.roomId
                    WHERE R.roomType = 'private'
                    AND CM1.userId = ?
                    AND CM2.userId = U.userId
                    AND (SELECT COUNT(*) FROM tbl_chat_member WHERE roomId = R.roomId) = 2
                    LIMIT 1
                ) AS existingRoomId
            FROM users_tbl U
            WHERE U.userId != ?
            AND (U.nickname LIKE ? OR U.userId LIKE ?)
            LIMIT 20
        `;

        const [users] = await db.query(sql, [
            currentUserId,
            currentUserId,
            searchPattern,
            searchPattern
        ]);

        res.json({
            users,
            result: "success"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Failed to search users" });
    }
});

// 搜索聊天室（用于搜索群聊）
router.get("/search/rooms", authMiddleware, async (req, res) => {
    const { query, userId } = req.query;

    if (!query || query.trim().length < 1) {
        return res.json({ rooms: [], result: "success" });
    }

    try {
        const searchPattern = `%${query.trim()}%`;
        
        const sql = `
            SELECT 
                R.roomId,
                R.roomType,
                R.roomName,
                R.relatedGroupId,
                G.groupName,
                G.district,
                -- 检查用户是否已在此聊天室
                (
                    SELECT COUNT(*) 
                    FROM tbl_chat_member 
                    WHERE roomId = R.roomId AND userId = ?
                ) AS isMember
            FROM tbl_chat_room R
            LEFT JOIN tbl_group G ON R.relatedGroupId = G.groupId
            WHERE R.roomType = 'group'
            AND (R.roomName LIKE ? OR G.groupName LIKE ?)
            LIMIT 20
        `;

        const [rooms] = await db.query(sql, [
            userId,
            searchPattern,
            searchPattern
        ]);

        res.json({
            rooms,
            result: "success"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Failed to search rooms" });
    }
});

module.exports = router;