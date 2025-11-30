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
-- Table structure for table `tbl_group_member`
--

DROP TABLE IF EXISTS `tbl_group_member`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_group_member` (
  `memberId` int NOT NULL AUTO_INCREMENT COMMENT '成员记录ID',
  `groupId` int NOT NULL COMMENT '队伍ID',
  `userId` varchar(50) NOT NULL COMMENT '成员userId',
  `role` enum('leader','member') NOT NULL DEFAULT 'member' COMMENT '角色',
  `assignedSegmentId` int DEFAULT NULL COMMENT '分配的分段ID',
  `joinedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '加入时间',
  `completionRate` decimal(5,2) NOT NULL DEFAULT '0.00' COMMENT '完成率(%)',
  `totalActivities` int NOT NULL DEFAULT '0' COMMENT '参加的总活动次数',
  `completedActivities` int NOT NULL DEFAULT '0' COMMENT '完成的活动次数',
  `cdatetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `udatetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`memberId`),
  UNIQUE KEY `unique_group_user` (`groupId`,`userId`),
  KEY `userId` (`userId`),
  KEY `assignedSegmentId` (`assignedSegmentId`),
  CONSTRAINT `tbl_group_member_ibfk_1` FOREIGN KEY (`groupId`) REFERENCES `tbl_group` (`groupId`) ON DELETE CASCADE,
  CONSTRAINT `tbl_group_member_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users_tbl` (`userId`) ON DELETE CASCADE,
  CONSTRAINT `tbl_group_member_ibfk_3` FOREIGN KEY (`assignedSegmentId`) REFERENCES `tbl_route_segment` (`segmentId`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='队伍成员表-记录谁在哪个队伍负责哪一段';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_group_member`
--

LOCK TABLES `tbl_group_member` WRITE;
/*!40000 ALTER TABLE `tbl_group_member` DISABLE KEYS */;
INSERT INTO `tbl_group_member` VALUES (1,2,'elle123','leader',1,'2025-11-28 10:56:59',0.00,0,0,'2025-11-28 10:56:59','2025-11-28 10:56:59'),(2,3,'elle123','leader',7,'2025-11-28 11:43:14',0.00,0,0,'2025-11-28 11:43:14','2025-11-28 11:43:14'),(3,4,'elle123','leader',9,'2025-11-28 15:47:32',0.00,0,0,'2025-11-28 15:47:32','2025-11-28 15:47:32'),(4,4,'elle789','member',11,'2025-11-30 12:07:36',0.00,0,0,'2025-11-30 12:07:36','2025-11-30 12:07:36'),(5,4,'elle456','member',10,'2025-11-30 12:07:42',0.00,0,0,'2025-11-30 12:07:42','2025-11-30 12:07:42'),(6,3,'elle123456','member',8,'2025-11-30 12:10:26',0.00,0,0,'2025-11-30 12:10:26','2025-11-30 12:10:26'),(7,5,'elle123','leader',12,'2025-11-30 13:23:11',0.00,0,0,'2025-11-30 13:23:11','2025-11-30 13:23:11'),(8,6,'elle123','leader',16,'2025-11-30 13:44:29',0.00,0,0,'2025-11-30 13:44:29','2025-11-30 13:44:29'),(9,7,'elle123','leader',19,'2025-11-30 16:28:50',0.00,0,0,'2025-11-30 16:28:50','2025-11-30 16:28:50'),(10,7,'elle456','member',20,'2025-11-30 16:34:42',0.00,0,0,'2025-11-30 16:34:42','2025-11-30 16:34:42'),(11,8,'elle123','leader',23,'2025-11-30 16:39:06',57.14,6,4,'2025-11-30 16:39:06','2025-11-30 20:07:24'),(12,8,'elle456','member',25,'2025-11-30 18:35:30',57.14,6,3,'2025-11-30 18:35:30','2025-11-30 20:07:24'),(13,8,'elle789','member',24,'2025-11-30 18:35:33',71.43,6,4,'2025-11-30 18:35:33','2025-11-30 20:07:24');
/*!40000 ALTER TABLE `tbl_group_member` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-30 20:52:53
