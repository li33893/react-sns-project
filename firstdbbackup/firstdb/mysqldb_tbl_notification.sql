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
-- Table structure for table `tbl_notification`
--

DROP TABLE IF EXISTS `tbl_notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_notification` (
  `notificationId` int NOT NULL AUTO_INCREMENT,
  `userId` varchar(50) NOT NULL,
  `notificationType` enum('follow','feed_like','feed_comment','feed_favorite','comment_reply','app_approved','app_rejected','activity_reminder','leader_confirmation','new_follower','route_update') NOT NULL,
  `relatedType` varchar(50) DEFAULT NULL,
  `relatedId` int DEFAULT NULL,
  `fromUserId` varchar(50) DEFAULT NULL,
  `fromUserNickname` varchar(100) DEFAULT NULL,
  `fromUserProfileImg` varchar(500) DEFAULT NULL,
  `content` varchar(255) DEFAULT NULL,
  `isRead` tinyint(1) NOT NULL DEFAULT '0',
  `readAt` datetime DEFAULT NULL,
  `cdatetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `udatetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`notificationId`),
  KEY `userId` (`userId`),
  CONSTRAINT `tbl_notification_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users_tbl` (`userId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_notification`
--

LOCK TABLES `tbl_notification` WRITE;
/*!40000 ALTER TABLE `tbl_notification` DISABLE KEYS */;
INSERT INTO `tbl_notification` VALUES (1,'elle123','feed_comment','feed',3,NULL,NULL,NULL,NULL,1,'2025-11-28 09:12:31','2025-11-27 13:05:41','2025-11-28 09:12:31'),(2,'elle123','feed_like','feed',6,NULL,NULL,NULL,NULL,1,'2025-11-27 17:26:00','2025-11-27 13:05:47','2025-11-27 17:26:00'),(3,'elle123','feed_like','feed',4,NULL,NULL,NULL,NULL,1,'2025-11-27 17:26:01','2025-11-27 13:05:50','2025-11-27 17:26:01'),(4,'elle123','feed_comment','feed',11,'elle456','李美玲',NULL,NULL,1,'2025-11-27 17:26:01','2025-11-27 16:59:29','2025-11-27 17:26:01'),(5,'elle123','feed_comment','feed',11,'elle456','李美玲',NULL,NULL,1,'2025-11-28 09:12:27','2025-11-27 16:59:42','2025-11-28 09:12:27'),(6,'elle123','feed_comment','feed',11,'elle789','黑松哥哥',NULL,NULL,1,'2025-11-27 17:26:03','2025-11-27 17:10:07','2025-11-27 17:26:03'),(7,'elle123','feed_like','feed',11,'elle789','黑松哥哥',NULL,NULL,1,'2025-11-27 17:25:47','2025-11-27 17:12:19','2025-11-27 17:25:47'),(8,'elle123','feed_comment','feed',11,'elle123456','这不是脾气是所谓志气',NULL,NULL,1,'2025-11-27 18:07:09','2025-11-27 17:30:37','2025-11-27 18:07:09'),(9,'elle123','feed_comment','feed',11,'elle123456','这不是脾气是所谓志气',NULL,NULL,1,'2025-11-28 09:12:24','2025-11-27 17:31:06','2025-11-28 09:12:24'),(10,'elle789','comment_reply','feed',11,'elle123456','这不是脾气是所谓志气',NULL,'@黑松哥哥 支持世界毁灭',0,NULL,'2025-11-27 17:31:06','2025-11-27 17:31:06'),(11,'elle456','new_follower','user',NULL,'elle123456','这不是脾气是所谓志气','http://localhost:3010/uploads/avatars/1764232174868-è.webp',NULL,1,'2025-11-27 18:05:45','2025-11-27 17:45:35','2025-11-27 18:05:45'),(12,'elle123','feed_like','feed',11,'elle456','李美玲',NULL,NULL,1,'2025-11-28 16:02:46','2025-11-27 18:01:51','2025-11-28 16:02:46'),(13,'elle123','feed_like','feed',10,'elle456','李美玲',NULL,NULL,1,'2025-11-28 16:02:49','2025-11-27 18:04:36','2025-11-28 16:02:49'),(14,'elle123','feed_comment','feed',13,'elle456','李美玲',NULL,NULL,1,'2025-11-28 09:12:37','2025-11-28 09:11:24','2025-11-28 09:12:37'),(15,'elle123','app_approved','group',4,'elle456','李美玲',NULL,'test2 팀에 새로운 신청이 있습니다',1,'2025-11-28 16:03:18','2025-11-28 15:48:36','2025-11-28 16:03:18'),(16,'elle123','app_approved','group',4,'elle789','黑松哥哥',NULL,'test2 팀에 새로운 신청이 있습니다',1,'2025-11-28 16:03:05','2025-11-28 15:49:23','2025-11-28 16:03:05');
/*!40000 ALTER TABLE `tbl_notification` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-28 18:05:41
