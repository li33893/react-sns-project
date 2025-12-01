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
-- Table structure for table `tbl_chat_member`
--

DROP TABLE IF EXISTS `tbl_chat_member`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_chat_member` (
  `chatMemberId` int NOT NULL AUTO_INCREMENT COMMENT '聊天成员ID',
  `roomId` int NOT NULL COMMENT '聊天室ID',
  `userId` varchar(50) NOT NULL COMMENT '成员userId',
  `joinedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '加入时间',
  `lastReadAt` datetime DEFAULT NULL COMMENT '最后阅读时间',
  `cdatetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`chatMemberId`),
  UNIQUE KEY `unique_room_user` (`roomId`,`userId`),
  KEY `userId` (`userId`),
  CONSTRAINT `tbl_chat_member_ibfk_1` FOREIGN KEY (`roomId`) REFERENCES `tbl_chat_room` (`roomId`) ON DELETE CASCADE,
  CONSTRAINT `tbl_chat_member_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users_tbl` (`userId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='聊天室成员表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_chat_member`
--

LOCK TABLES `tbl_chat_member` WRITE;
/*!40000 ALTER TABLE `tbl_chat_member` DISABLE KEYS */;
INSERT INTO `tbl_chat_member` VALUES (1,1,'elle123','2025-11-28 10:56:59',NULL,'2025-11-28 10:56:59'),(2,2,'elle123','2025-11-28 11:43:14',NULL,'2025-11-28 11:43:14'),(3,3,'elle123','2025-11-28 15:47:32',NULL,'2025-11-28 15:47:32');
/*!40000 ALTER TABLE `tbl_chat_member` ENABLE KEYS */;
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
