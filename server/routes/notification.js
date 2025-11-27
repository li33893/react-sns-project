const express = require('express');
const router = express.Router();
const db = require("../db");
const authMiddleware = require("../auth");

// 获取用户的所有通知
router.get("/", async (req, res) => {
    let { userId } = req.query;
    
    if (!userId) {
        return res.status(400).json({ message: "userId is required" });
    }

    try {
        let sql = `
            SELECT * FROM TBL_NOTIFICATION
            WHERE userId = ?
            ORDER BY cdatetime DESC
            LIMIT 50
        `;
        let [notifications] = await db.query(sql, [userId]);
        
        res.json({
            notifications,
            result: "success"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Failed to get notifications",
            error: error.message
        });
    }
});

// 获取未读通知数量
router.get("/unread-count", async (req, res) => {
    let { userId } = req.query;
    
    if (!userId) {
        return res.status(400).json({ message: "userId is required" });
    }

    try {
        let sql = `
            SELECT COUNT(*) as count 
            FROM TBL_NOTIFICATION
            WHERE userId = ? AND isRead = FALSE
        `;
        let [[result]] = await db.query(sql, [userId]);
        
        res.json({
            count: result.count,
            result: "success"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Failed to get unread count",
            error: error.message
        });
    }
});

// 标记通知为已读
router.put("/:notificationId/read", authMiddleware, async (req, res) => {
    let { notificationId } = req.params;

    try {
        let sql = `
            UPDATE TBL_NOTIFICATION 
            SET isRead = TRUE, readAt = NOW(), udatetime = NOW()
            WHERE notificationId = ?
        `;
        await db.query(sql, [notificationId]);
        
        res.json({
            msg: "통지를 읽음으로 표시했습니다",
            result: "success"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Failed to mark as read",
            error: error.message
        });
    }
});

// 标记所有通知为已读
router.put("/read-all", authMiddleware, async (req, res) => {
    let { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ message: "userId is required" });
    }

    try {
        let sql = `
            UPDATE TBL_NOTIFICATION 
            SET isRead = TRUE, readAt = NOW(), udatetime = NOW()
            WHERE userId = ? AND isRead = FALSE
        `;
        await db.query(sql, [userId]);
        
        res.json({
            msg: "모든 알림을 읽음으로 표시했습니다",
            result: "success"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Failed to mark all as read",
            error: error.message
        });
    }
});

// 删除通知
router.delete("/:notificationId", authMiddleware, async (req, res) => {
    let { notificationId } = req.params;

    try {
        let sql = "DELETE FROM TBL_NOTIFICATION WHERE notificationId = ?";
        await db.query(sql, [notificationId]);
        
        res.json({
            msg: "알림이 삭제되었습니다",
            result: "success"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Failed to delete notification",
            error: error.message
        });
    }
});

// 创建通知（内部使用 - 当有点赞、评论等操作时调用）
router.post("/create", async (req, res) => {
    let { userId, notificationType, relatedType, relatedId, content } = req.body;

    if (!userId || !notificationType) {
        return res.status(400).json({ 
            message: "userId and notificationType are required" 
        });
    }

    try {
        let sql = `
            INSERT INTO TBL_NOTIFICATION 
            (userId, notificationType, relatedType, relatedId, content, isRead, cdatetime, udatetime)
            VALUES (?, ?, ?, ?, ?, FALSE, NOW(), NOW())
        `;
        let [result] = await db.query(sql, [
            userId,
            notificationType,
            relatedType || null,
            relatedId || null,
            content || null
        ]);
        
        res.json({
            notificationId: result.insertId,
            msg: "알림이 생성되었습니다",
            result: "success"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Failed to create notification",
            error: error.message
        });
    }
});

module.exports = router;