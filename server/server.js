const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');
const initializeSocket = require('./socket');

// 路由导入
const userRouter = require("./routes/user");
const feedRouter = require("./routes/feed");
const groupRouter = require('./routes/group');
const notificationRouter = require("./routes/notification");
const messageRouter = require("./routes/message");

// 1️⃣ 先创建 app
const app = express();

// 2️⃣ 配置中间件
app.use(cors({
    origin: "*",
    credentials: true
}));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 3️⃣ 创建 HTTP 服务器
const server = http.createServer(app);

// 4️⃣ 初始化 Socket.IO
const io = initializeSocket(server);

// 5️⃣ 🔥 关键：让所有路由都能访问 io 实例（必须在路由之前！）
app.set('io', io);

// 6️⃣ 路由配置（必须在 app.set 之后！）
app.use("/user", userRouter);
app.use("/feed", feedRouter);
app.use('/group', groupRouter);
app.use("/notification", notificationRouter);
app.use("/message", messageRouter);

// 7️⃣ 启动服务器
server.listen(3010, () => {
  console.log("✅ 서버가 3010 포트에서 실행 중입니다");
  console.log("✅ Socket.IO가 활성화되었습니다");
});