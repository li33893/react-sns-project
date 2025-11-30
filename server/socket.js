const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const db = require('./db');

const JWT_KEY = "server_secret_key";

function initializeSocket(server) {
  const io = socketIo(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  // 身份验证中间件
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('认证失败'));
    }

    try {
      const decoded = jwt.verify(token, JWT_KEY);
      socket.userId = decoded.userId;
      next();
    } catch (error) {
      next(new Error('无效的token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`✅ 用户连接: ${socket.userId}`);

    // 加入聊天室
    socket.on('join_room', ({ roomId, userId }) => {
      socket.join(`room_${roomId}`);
      console.log(`📥 ${userId} 加入房间 ${roomId}`);
    });

    // 离开聊天室
    socket.on('leave_room', ({ roomId }) => {
      socket.leave(`room_${roomId}`);
      console.log(`📤 ${socket.userId} 离开房间 ${roomId}`);
    });

    // 发送消息
    socket.on('send_message', async (messageData) => {
      try {
        const { roomId, senderId, content } = messageData;

        // 验证用户是否在聊天室
        const [membership] = await db.query(
          "SELECT * FROM tbl_chat_member WHERE roomId = ? AND userId = ?",
          [roomId, senderId]
        );

        if (membership.length === 0) {
          socket.emit('error', { message: '채팅방 멤버가 아닙니다' });
          return;
        }

        // 保存消息到数据库
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

        // 广播给房间内所有用户
        io.to(`room_${roomId}`).emit('new_message', messages[0]);

        console.log(`💬 ${senderId} 在房间 ${roomId} 发送了消息`);
      } catch (error) {
        console.error('发送消息失败:', error);
        socket.emit('error', { message: '메시지 전송 실패' });
      }
    });

    // 正在输入状态
    socket.on('typing', ({ roomId, userId, nickname }) => {
      socket.to(`room_${roomId}`).emit('user_typing', { userId, nickname });
    });

    // 停止输入状态
    socket.on('stop_typing', ({ roomId, userId }) => {
      socket.to(`room_${roomId}`).emit('user_stop_typing', { userId });
    });

    // 断开连接
    socket.on('disconnect', () => {
      console.log(`❌ 用户断开连接: ${socket.userId}`);
    });
  });

  return io;
}

module.exports = initializeSocket;