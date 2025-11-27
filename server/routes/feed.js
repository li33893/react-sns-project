const express = require('express');
const router = express.Router();
const db = require("../db");
const authMiddleware = require("../auth");
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// ⭐ 上传图片
router.post('/upload', upload.array('file', 9), async (req, res) => {
    let { feedId } = req.body;
    const files = req.files;

    if (!files || files.length === 0) {
        return res.status(400).json({ message: "No files uploaded" });
    }

    if (files.length > 9) {
        return res.status(400).json({ message: "최대 9개의 이미지만 업로드할 수 있습니다" });
    }

    try {
        let results = [];
        let host = `${req.protocol}://${req.get("host")}/`;
        
        for (let i = 0; i < files.length; i++) {
            let file = files[i];
            let filename = file.filename;
            let destination = file.destination;
            let isThumbnail = (i === 0);
            
            let query = "INSERT INTO TBL_FEED_IMG (feedId, fileName, filePath, is_thumbnail, cdatetime, udatetime) VALUES(?, ?, ?, ?, NOW(), NOW())";
            let result = await db.query(query, [feedId, filename, host + destination + filename, isThumbnail]);
            results.push(result);
        }
        
        res.json({ message: "success", result: results });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Upload failed", error: err.message });
    }
});

// ⭐ 获取所有动态（首页feed列表）- 添加搜索功能
router.get("/", async (req, res) => {
    let { feedType, filter, userId, search } = req.query;

    try {
        let sql = `
            SELECT 
                F.feedId, F.userId, F.feedType, F.title, F.content, F.location,
                F.likeCnt, F.favorCnt, F.commentCnt, F.isAnonymous, F.cdatetime,
                I.imgId, I.fileName, I.filePath, I.is_thumbnail,
                U.nickname, U.profileImg, U.addr,
                (SELECT COUNT(*) FROM TBL_FEED_LIKE WHERE feedId = F.feedId AND userId = ?) as isLiked,
                (SELECT COUNT(*) FROM TBL_FEED_FAVORITE WHERE feedId = F.feedId AND userId = ?) as isFavorited
            FROM TBL_FEED F 
            LEFT JOIN TBL_FEED_IMG I ON F.feedId = I.feedId 
            LEFT JOIN users_tbl U ON F.userId = U.userId 
            WHERE 1=1
        `;

        let params = [userId, userId];

        if (feedType && feedType !== 'all') {
            sql += " AND F.feedType = ?";
            params.push(feedType);
        }

        if (filter === 'location' && userId) {
            sql += ` AND F.userId IN (
                SELECT u2.userId FROM users_tbl u2
                WHERE u2.addr = (SELECT addr FROM users_tbl WHERE userId = ?)
            )`;
            params.push(userId);
        }

        // ⭐ 搜索功能
        if (search && search.trim()) {
            sql += " AND (F.title LIKE ? OR F.content LIKE ?)";
            let searchPattern = `%${search.trim()}%`;
            params.push(searchPattern, searchPattern);
        }

        sql += " ORDER BY F.cdatetime DESC";

        let [list] = await db.query(sql, params);

        // 将结果按feedId分组
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

        let feeds = Object.values(feedsMap);

        res.json({ list: feeds, result: "success" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to get feeds", error: error.message });
    }
});

// 获取用户的所有动态
router.get("/:userId", async (req, res) => {
    let { userId } = req.params;
    let { viewerId } = req.query; // 查看者ID，用于判断点赞收藏状态
    
    try {
        let sql = `
            SELECT 
                F.feedId, F.userId, F.feedType, F.title, F.content, F.location,
                F.likeCnt, F.favorCnt, F.commentCnt, F.isAnonymous, F.cdatetime,
                I.imgId, I.fileName, I.filePath, I.is_thumbnail,
                ${viewerId ? `(SELECT COUNT(*) FROM TBL_FEED_LIKE WHERE feedId = F.feedId AND userId = ?) as isLiked,` : '0 as isLiked,'}
                ${viewerId ? `(SELECT COUNT(*) FROM TBL_FEED_FAVORITE WHERE feedId = F.feedId AND userId = ?) as isFavorited` : '0 as isFavorited'}
            FROM TBL_FEED F 
            LEFT JOIN TBL_FEED_IMG I ON F.feedId = I.feedId 
            WHERE F.userId = ?
            ORDER BY F.cdatetime DESC
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
        res.status(500).json({ message: "Failed to get feeds", error: error.message });
    }
});

// 删除动态
router.delete("/:feedId", authMiddleware, async (req, res) => {
    let { feedId } = req.params;
    try {
        let sql = "DELETE FROM TBL_FEED WHERE feedId = ?";
        await db.query(sql, [feedId]);
        res.json({ result: "success", msg: "삭제 완료" });
    } catch (error) {
        console.log("에러 발생!", error);
        res.status(500).json({ message: "Delete failed", error: error.message });
    }
});

// 创建动态
router.post("/", async (req, res) => {
    let { userId, title, content, feedType, isAnonymous, groupId, routeId, historyId, location } = req.body;

    if (!userId || !content || !feedType) {
        return res.status(400).json({ message: "필수 항목을 입력해주세요 (userId, content, feedType)" });
    }

    if (!['group', 'daily', 'vent'].includes(feedType)) {
        return res.status(400).json({ message: "feedType은 group, daily, vent 중 하나여야 합니다" });
    }

    try {
        let sql = "INSERT INTO TBL_FEED (userId, feedType, title, groupId, routeId, historyId, location, content, isAnonymous, likeCnt, favorCnt, commentCnt, cdatetime, udatetime) " +
            "VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, 0, NOW(), NOW())";

        let [result] = await db.query(sql, [
            userId, feedType, title || null, groupId || null,
            routeId || null, historyId || null, location || null,
            content, isAnonymous || false
        ]);

        res.json({ result: [{ insertId: result.insertId }], msg: "success" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to create feed", error: error.message });
    }
});

// 点赞功能
router.post("/:feedId/like", authMiddleware, async (req, res) => {
    let { feedId } = req.params;
    let { userId } = req.body;

    try {
        let checkSql = "SELECT * FROM TBL_FEED_LIKE WHERE feedId = ? AND userId = ?";
        let [existing] = await db.query(checkSql, [feedId, userId]);

        if (existing.length > 0) {
            await db.query("DELETE FROM TBL_FEED_LIKE WHERE feedId = ? AND userId = ?", [feedId, userId]);
            await db.query("UPDATE TBL_FEED SET likeCnt = likeCnt - 1 WHERE feedId = ?", [feedId]);
            res.json({ msg: "좋아요 취소", liked: false });
        } else {
            await db.query("INSERT INTO TBL_FEED_LIKE (feedId, userId, cdatetime) VALUES(?, ?, NOW())", [feedId, userId]);
            await db.query("UPDATE TBL_FEED SET likeCnt = likeCnt + 1 WHERE feedId = ?", [feedId]);

            let [feedInfo] = await db.query("SELECT userId FROM TBL_FEED WHERE feedId = ?", [feedId]);
            let feedOwnerId = feedInfo[0]?.userId;

            if (feedOwnerId && feedOwnerId !== userId) {
                let [likerInfo] = await db.query("SELECT nickname FROM users_tbl WHERE userId = ?", [userId]);
                let notificationSql = `
                    INSERT INTO TBL_NOTIFICATION 
                    (userId, notificationType, relatedType, relatedId, fromUserId, fromUserNickname, isRead, cdatetime, udatetime)
                    VALUES (?, 'feed_like', 'feed', ?, ?, ?, FALSE, NOW(), NOW())
                `;
                await db.query(notificationSql, [feedOwnerId, feedId, userId, likerInfo[0]?.nickname || userId]);
            }

            res.json({ msg: "좋아요", liked: true });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Like failed", error: error.message });
    }
});

// 收藏功能
router.post("/:feedId/favorite", authMiddleware, async (req, res) => {
    let { feedId } = req.params;
    let { userId } = req.body;

    try {
        let checkSql = "SELECT * FROM TBL_FEED_FAVORITE WHERE feedId = ? AND userId = ?";
        let [existing] = await db.query(checkSql, [feedId, userId]);

        if (existing.length > 0) {
            await db.query("DELETE FROM TBL_FEED_FAVORITE WHERE feedId = ? AND userId = ?", [feedId, userId]);
            await db.query("UPDATE TBL_FEED SET favorCnt = favorCnt - 1 WHERE feedId = ?", [feedId]);
            res.json({ msg: "즐겨찾기 취소", favorited: false });
        } else {
            await db.query("INSERT INTO TBL_FEED_FAVORITE (feedId, userId, cdatetime) VALUES(?, ?, NOW())", [feedId, userId]);
            await db.query("UPDATE TBL_FEED SET favorCnt = favorCnt + 1 WHERE feedId = ?", [feedId]);
            res.json({ msg: "즐겨찾기 추가", favorited: true });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Favorite failed", error: error.message });
    }
});

// ⭐ 评论功能 - 支持 @ 回复
router.post("/:feedId/comment", authMiddleware, async (req, res) => {
    let { feedId } = req.params;
    let { userId, content, replyToUserId } = req.body;

    if (!content) {
        return res.status(400).json({ message: "댓글 내용을 입력해주세요" });
    }

    try {
        let replyToNickname = null;
        if (replyToUserId) {
            let [replyUser] = await db.query("SELECT nickname FROM users_tbl WHERE userId = ?", [replyToUserId]);
            replyToNickname = replyUser[0]?.nickname || replyToUserId;
        }

        let insertSql = "INSERT INTO TBL_COMMENT (feedId, userId, content, replyToUserId, replyToNickname, cdatetime) VALUES(?, ?, ?, ?, ?, NOW())";
        await db.query(insertSql, [feedId, userId, content, replyToUserId || null, replyToNickname]);

        await db.query("UPDATE TBL_FEED SET commentCnt = commentCnt + 1 WHERE feedId = ?", [feedId]);

        // 通知 feed 作者
        let [feedInfo] = await db.query("SELECT userId FROM TBL_FEED WHERE feedId = ?", [feedId]);
        let feedOwnerId = feedInfo[0]?.userId;

        if (feedOwnerId && feedOwnerId !== userId) {
            let [commenterInfo] = await db.query("SELECT nickname FROM users_tbl WHERE userId = ?", [userId]);
            let notificationSql = `
                INSERT INTO TBL_NOTIFICATION 
                (userId, notificationType, relatedType, relatedId, fromUserId, fromUserNickname, isRead, cdatetime, udatetime)
                VALUES (?, 'feed_comment', 'feed', ?, ?, ?, FALSE, NOW(), NOW())
            `;
            await db.query(notificationSql, [feedOwnerId, feedId, userId, commenterInfo[0]?.nickname || userId]);
        }

        // 如果是回复某人，通知被回复者
        if (replyToUserId && replyToUserId !== userId && replyToUserId !== feedOwnerId) {
            let [commenterInfo] = await db.query("SELECT nickname FROM users_tbl WHERE userId = ?", [userId]);
            let notificationSql = `
                INSERT INTO TBL_NOTIFICATION 
                (userId, notificationType, relatedType, relatedId, fromUserId, fromUserNickname, content, isRead, cdatetime, udatetime)
                VALUES (?, 'comment_reply', 'feed', ?, ?, ?, ?, FALSE, NOW(), NOW())
            `;
            await db.query(notificationSql, [replyToUserId, feedId, userId, commenterInfo[0]?.nickname || userId, content.substring(0, 50)]);
        }

        res.json({ msg: "댓글 작성 완료" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Comment failed", error: error.message });
    }
});

// 获取评论列表
router.get("/:feedId/comments", async (req, res) => {
    let { feedId } = req.params;

    try {
        let sql = `
            SELECT 
                C.*, 
                U.nickname, 
                U.profileImg,
                C.replyToUserId,
                C.replyToNickname
            FROM TBL_COMMENT C 
            LEFT JOIN users_tbl U ON C.userId = U.userId 
            WHERE C.feedId = ? 
            ORDER BY C.cdatetime ASC
        `;
        let [comments] = await db.query(sql, [feedId]);
        res.json({ comments, result: "success" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to get comments", error: error.message });
    }
});

module.exports = router;