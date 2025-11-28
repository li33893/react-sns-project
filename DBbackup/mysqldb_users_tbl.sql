-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: mysqldb
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `users_tbl`
--

DROP TABLE IF EXISTS `users_tbl`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users_tbl` (
  `userId` varchar(50) NOT NULL COMMENT '用户ID',
  `email` varchar(100) NOT NULL COMMENT '邮箱',
  `pwd` varchar(255) NOT NULL COMMENT '密码',
  `nickName` varchar(50) NOT NULL COMMENT '昵称',
  `addr` varchar(200) DEFAULT NULL COMMENT '地址',
  `comorbidity` text COMMENT '共患病情况',
  `profileImg` longtext COMMENT '头像(Base64 或 URL)',
  `completionRate` decimal(5,2) NOT NULL DEFAULT '0.00' COMMENT '完成率',
  `intro` varchar(200) DEFAULT NULL COMMENT '简介',
  `cdatetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `udatetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_tbl`
--

LOCK TABLES `users_tbl` WRITE;
/*!40000 ALTER TABLE `users_tbl` DISABLE KEYS */;
INSERT INTO `users_tbl` VALUES ('Elle','lmeiling322830@gmail.com','$2b$10$Fi8oKwl1nsn38L0KQuuMFO9w3t/XpojuFl9iEtiA45d5ZQ05dU5e.','elle','인천 부평구 가재울로 129','bipolar2','data:image/png;base64,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',0.00,NULL,'2025-11-26 15:56:51','2025-11-26 15:56:51'),('elle123','lmeiling322830@gmail.com','$2b$10$MmIu.afya6KJwIiAxRqZLuBySbKYBNhGlpLpL/T1T9hGTS21IEz/G','elle','경기 성남시 분당구 판교역로 166','bipolar2','http://localhost:3010/uploads/avatars/1764225661942-è¯¥æ­»çå¦æå¶äºº.webp',99.00,'正是在下','2025-11-26 16:47:44','2025-11-28 11:37:32'),('elle123456','test123@naver.com','$2b$10$r4MSQdJxlIB.8L02A2txQO3Nu9MziVOMYBlZgoHZMX9qh5kDcAZMy','这不是脾气是所谓志气','경기 성남시 분당구 판교역로 166','없음','http://localhost:3010/uploads/avatars/1764232174868-è.webp',0.00,'菜得一批','2025-11-27 17:29:34','2025-11-27 17:30:06'),('elle456','lmeiling322830@gmail.com','$2b$10$s4XaTUOhL0jC8RC6m0ajP.AH28uGktS1ZHC/aUGmkUZnsKZI2pN0C','李美玲','경기 성남시 분당구 판교역로 166','老寒腿','http://localhost:3010/uploads/avatars/1764229458616-ä½äº.webp',0.00,'合法的正常人一个','2025-11-27 13:05:14','2025-11-27 17:06:03'),('elle789','lmeiling@djfklds.com','$2b$10$MtUrOvutP9nO3WtUQeRQ3.sh8CH6gPFiWIYacwjtYFDcCT1vuDLu2','黑松哥哥','경기 성남시 분당구 고기로 25','PMS','http://localhost:3010/uploads/avatars/1764231109073-ç.webp',0.00,'ai作弊狗一枚~','2025-11-27 17:09:33','2025-11-27 17:12:09'),('elleli','lmeiling322830@gmail.com','hashed_password_elleli','elle','인천 부평구 경인로 지하 877','없음','https://example.com/profile_elleli.jpg',0.00,NULL,'2025-11-26 15:56:29','2025-11-26 15:56:29'),('sunny101','user101@example.com','hashed_password_101','Sunny','Beijing Haidian District','Hypertension','https://example.com/profile101.jpg',85.50,NULL,'2025-11-26 15:56:29','2025-11-26 15:56:29');
/*!40000 ALTER TABLE `users_tbl` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-28 18:05:42
