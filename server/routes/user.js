const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const db = require("../db");
const jwt = require('jsonwebtoken');
const multer = require('multer');
const authMiddleware = require("../auth");

const JWT_KEY = "server_secret_key";

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/avatars/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// ⭐ 获取用户信息（包含统计数据和关注状态）
router.get("/:userId", async (req, res) => {
    let { userId } = req.params;
    let { viewerId } = req.query; // 查看者ID，用于判断是否已关注
    
    try {
        let userSql = "SELECT * FROM users_tbl WHERE userId = ?";
        let [userList] = await db.query(userSql, [userId]);
        
        if (userList.length === 0) {
            return res.status(404).json({ result: "fail", msg: "사용자를 찾을 수 없습니다" });
        }
        
        let user = userList[0];
        
        let feedCountSql = "SELECT COUNT(*) as cnt FROM TBL_FEED WHERE userId = ?";
        let [[feedCount]] = await db.query(feedCountSql, [userId]);
        
        let followerSql = "SELECT COUNT(*) as cnt FROM TBL_FOLLOW WHERE following_no = ?";
        let [[followerCount]] = await db.query(followerSql, [userId]);
        
        let followingSql = "SELECT COUNT(*) as cnt FROM TBL_FOLLOW WHERE follower_no = ?";
        let [[followingCount]] = await db.query(followingSql, [userId]);
        
        // 检查查看者是否已关注此用户
        let isFollowing = false;
        if (viewerId && viewerId !== userId) {
            let checkFollowSql = "SELECT COUNT(*) as cnt FROM TBL_FOLLOW WHERE follower_no = ? AND following_no = ?";
            let [[followStatus]] = await db.query(checkFollowSql, [viewerId, userId]);
            isFollowing = followStatus.cnt > 0;
        }
        
        res.json({
            user: {
                ...user,
                cnt: feedCount.cnt,
                follower: followerCount.cnt,
                following: followingCount.cnt,
                isFollowing: isFollowing
            },
            result: "success"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ result: "fail", msg: "서버 오류" });
    }
});


// ⭐ 关注/取消关注 - 最终版本
router.post("/:userId/follow", authMiddleware, async (req, res) => {
    let { userId } = req.params; // 被关注者
    let { followerId } = req.body; // 关注者

    if (userId === followerId) {
        return res.status(400).json({ msg: "자신을 팔로우할 수 없습니다" });
    }

    try {
        let checkSql = "SELECT * FROM TBL_FOLLOW WHERE follower_no = ? AND following_no = ?";
        let [existing] = await db.query(checkSql, [followerId, userId]);

        if (existing.length > 0) {
            // 取消关注
            await db.query("DELETE FROM TBL_FOLLOW WHERE follower_no = ? AND following_no = ?", [followerId, userId]);
            res.json({ msg: "팔로우 취소", isFollowing: false });
        } else {
            // 关注
            await db.query("INSERT INTO TBL_FOLLOW (follower_no, following_no, cdatetime) VALUES(?, ?, NOW())", [followerId, userId]);
            
            // 查询关注者信息
            let [followerInfo] = await db.query("SELECT nickName, profileImg FROM users_tbl WHERE userId = ?", [followerId]);
            
            console.log('📢 发送关注通知:', {
                被关注者: userId,
                关注者: followerId,
                关注者昵称: followerInfo[0]?.nickName,
                关注者头像: followerInfo[0]?.profileImg
            });
            
            // 插入通知 - 根据是否有 fromUserProfileImg 字段决定
            let notificationSql = `
                INSERT INTO TBL_NOTIFICATION 
                (userId, notificationType, relatedType, relatedId, fromUserId, fromUserNickname, fromUserProfileImg, isRead, cdatetime, udatetime)
                VALUES (?, 'new_follower', 'user', NULL, ?, ?, ?, FALSE, NOW(), NOW())
            `;
            
            try {
                let [notifResult] = await db.query(notificationSql, [
                    userId,
                    followerId, 
                    followerInfo[0]?.nickName || followerId,
                    followerInfo[0]?.profileImg || null
                ]);
                console.log('✅ 通知已创建，ID:', notifResult.insertId);
            } catch (notifError) {
                // 如果 fromUserProfileImg 字段不存在，使用不带该字段的 SQL
                if (notifError.code === 'ER_BAD_FIELD_ERROR') {
                    console.log('⚠️  fromUserProfileImg 字段不存在，使用简化版插入');
                    let simpleSql = `
                        INSERT INTO TBL_NOTIFICATION 
                        (userId, notificationType, relatedType, relatedId, fromUserId, fromUserNickname, isRead, cdatetime, udatetime)
                        VALUES (?, 'new_follower', 'user', NULL, ?, ?, FALSE, NOW(), NOW())
                    `;
                    let [notifResult] = await db.query(simpleSql, [
                        userId,
                        followerId, 
                        followerInfo[0]?.nickName || followerId
                    ]);
                    console.log('✅ 通知已创建（无头像），ID:', notifResult.insertId);
                } else {
                    throw notifError;
                }
            }
            
            res.json({ msg: "팔로우 성공", isFollowing: true });
        }
    } catch (error) {
        console.log('❌ 关注失败:', error);
        res.status(500).json({ result: "fail", msg: "팔로우 실패" });
    }
});

// ⭐ 获取 follower 列表（关注我的人）
router.get("/:userId/followers", async (req, res) => {
    let { userId } = req.params;
    let { viewerId } = req.query; // 查看者ID
    
    try {
        let sql = `
            SELECT 
                U.userId, U.nickname, U.profileImg, U.intro,
                F.cdatetime as followedAt
                ${viewerId ? `, (SELECT COUNT(*) FROM TBL_FOLLOW WHERE follower_no = ? AND following_no = U.userId) as isFollowing` : ''}
            FROM TBL_FOLLOW F
            JOIN users_tbl U ON F.follower_no = U.userId
            WHERE F.following_no = ?
            ORDER BY F.cdatetime DESC
        `;
        
        let params = viewerId ? [viewerId, userId] : [userId];
        let [followers] = await db.query(sql, params);
        
        res.json({ followers, result: "success" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ result: "fail", msg: "Failed to get followers" });
    }
});

// ⭐ 获取 following 列表（我关注的人）
router.get("/:userId/following", async (req, res) => {
    let { userId } = req.params;
    let { viewerId } = req.query;
    
    try {
        let sql = `
            SELECT 
                U.userId, U.nickname, U.profileImg, U.intro,
                F.cdatetime as followedAt
                ${viewerId ? `, (SELECT COUNT(*) FROM TBL_FOLLOW WHERE follower_no = ? AND following_no = U.userId) as isFollowing` : ''}
            FROM TBL_FOLLOW F
            JOIN users_tbl U ON F.following_no = U.userId
            WHERE F.follower_no = ?
            ORDER BY F.cdatetime DESC
        `;
        
        let params = viewerId ? [viewerId, userId] : [userId];
        let [following] = await db.query(sql, params);
        
        res.json({ following, result: "success" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ result: "fail", msg: "Failed to get following" });
    }
});

// 更新用户信息
router.put("/:userId", authMiddleware, async (req, res) => {
    let { userId } = req.params;
    let { nickName, addr, comorbidity, intro } = req.body;
    
    try {
        let sql = `
            UPDATE users_tbl 
            SET nickName = ?, addr = ?, comorbidity = ?, intro = ?, udatetime = NOW()
            WHERE userId = ?
        `;
        
        await db.query(sql, [nickName, addr, comorbidity, intro, userId]);
        
        res.json({ result: "success", msg: "프로필이 업데이트되었습니다" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ result: "fail", msg: "업데이트 실패" });
    }
});

// 更新头像
router.put("/:userId/avatar", authMiddleware, upload.single('avatar'), async (req, res) => {
    let { userId } = req.params;
    const file = req.file;
    
    if (!file) {
        return res.status(400).json({ msg: "파일이 없습니다." });
    }
    
    try {
        const host = `${req.protocol}://${req.get("host")}/`;
        const avatarUrl = host + file.destination + file.filename;
        
        let sql = "UPDATE users_tbl SET profileImg = ?, udatetime = NOW() WHERE userId = ?";
        await db.query(sql, [avatarUrl, userId]);
        
        res.json({ result: "success", avatarUrl: avatarUrl, msg: "프로필 사진이 업데이트되었습니다" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ result: "fail", msg: "업데이트 실패" });
    }
});

// 获取用户收藏的 feeds
router.get("/:userId/favorites", async (req, res) => {
    let { userId } = req.params;
    let { viewerId } = req.query;
    
    try {
        let sql = `
            SELECT 
                F.feedId, F.userId, F.feedType, F.title, F.content, F.location,
                F.likeCnt, F.favorCnt, F.commentCnt, F.isAnonymous, F.cdatetime,
                I.imgId, I.fileName, I.filePath, I.is_thumbnail,
                U.nickname, U.profileImg,
                ${viewerId ? `(SELECT COUNT(*) FROM TBL_FEED_LIKE WHERE feedId = F.feedId AND userId = ?) as isLiked,` : '0 as isLiked,'}
                ${viewerId ? `(SELECT COUNT(*) FROM TBL_FEED_FAVORITE WHERE feedId = F.feedId AND userId = ?) as isFavorited` : '0 as isFavorited'}
            FROM TBL_FEED_FAVORITE FAV
            JOIN TBL_FEED F ON FAV.feedId = F.feedId
            LEFT JOIN TBL_FEED_IMG I ON F.feedId = I.feedId
            LEFT JOIN users_tbl U ON F.userId = U.userId
            WHERE FAV.userId = ?
            ORDER BY FAV.cdatetime DESC
        `;
        
        let params = viewerId ? [viewerId, viewerId, userId] : [userId];
        let [list] = await db.query(sql, params);
        
        let feedsMap = {};
        list.forEach(row => {
            if (!feedsMap[row.feedId]) {
                feedsMap[row.feedId] = {
                    feedId: row.feedId,
                    userId: row.userId,
                    feedType: row.feedType,
                    title: row.title,
                    content: row.content,
                    location: row.location,
                    likeCnt: row.likeCnt,
                    favorCnt: row.favorCnt,
                    commentCnt: row.commentCnt,
                    isAnonymous: row.isAnonymous,
                    cdatetime: row.cdatetime,
                    nickname: row.nickname,
                    profileImg: row.profileImg,
                    isLiked: row.isLiked > 0,
                    isFavorited: row.isFavorited > 0,
                    images: [],
                    thumbnail: null
                };
            }
            if (row.imgId) {
                let imgObj = {
                    imgId: row.imgId,
                    fileName: row.fileName,
                    filePath: row.filePath,
                    isThumbnail: row.is_thumbnail
                };
                feedsMap[row.feedId].images.push(imgObj);
                if (row.is_thumbnail) {
                    feedsMap[row.feedId].thumbnail = imgObj;
                }
            }
        });
        
        res.json({ list: Object.values(feedsMap), result: "success" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ result: "fail", msg: "Failed to get favorites" });
    }
});

// ID重复确认
router.post("/repCheck", async (req, res) => {
    let { userId } = req.body;
    try {
        let sql = "SELECT * FROM users_tbl WHERE userId = ?";
        let [list] = await db.query(sql, [userId]);
        let msg = list.length > 0 
            ? "이미 존재하는 아이디입니다. 다시 생각해주세요." 
            : "사용가능한 아이디입니다!";
        let result = list.length > 0 ? "fail" : "success";
        res.json({ result, msg });
    } catch (error) {
        console.log(error);
    }
});

// 头像上传
router.post('/upload-avatar', upload.single('avatar'), async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({ msg: "파일이 없습니다." });
        }

        const host = `${req.protocol}://${req.get("host")}/`;
        const avatarUrl = host + file.destination + file.filename;

        res.json({ result: "success", avatarUrl: avatarUrl, msg: "아바타 업로드 성공" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "서버 오류" });
    }
});

// 会员注册
router.post("/join", async (req, res) => {
    let { userId, pwd, nickName, email, address, comorbidity, avatarUrl } = req.body;

    try {
        const hashedPwd = await bcrypt.hash(pwd, 10);
        let sql = `INSERT INTO users_tbl 
                   (userId, email, pwd, nickName, addr, comorbidity, profileImg, completionRate, cdatetime, udatetime) 
                   VALUES (?, ?, ?, ?, ?, ?, ?, 100.00, NOW(), NOW())`;

        await db.query(sql, [userId, email, hashedPwd, nickName, address, comorbidity, avatarUrl || null]);
        res.json({ result: "success", msg: "회원가입 성공!" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ result: "fail", msg: "회원가입 실패" });
    }
});

// 登录
router.post("/login", async (req, res) => {
    let { userId, pwd } = req.body;

    try {
        let sql = "SELECT * FROM users_tbl WHERE userId = ?";
        let [list] = await db.query(sql, [userId]);

        if (list.length === 0) {
            return res.json({ result: false, msg: "아이디가 존재하지 않습니다.", token: null });
        }

        let match = await bcrypt.compare(pwd, list[0].pwd);

        if (!match) {
            return res.json({ result: false, msg: "비밀번호가 틀렸습니다.", token: null });
        }

        let user = {
            userId: list[0].userId,
            nickName: list[0].nickName,
            status: "A"
        };

        let token = jwt.sign(user, JWT_KEY, { expiresIn: '1h' });

        res.json({ result: true, msg: list[0].nickName + "님 환영합니다!", token });
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;