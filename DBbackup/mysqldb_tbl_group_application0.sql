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
-- Table structure for table `tbl_group_application`
--

DROP TABLE IF EXISTS `tbl_group_application`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_group_application` (
  `applicationId` int NOT NULL AUTO_INCREMENT COMMENT '申请ID',
  `groupId` int NOT NULL COMMENT '申请的队伍ID',
  `userId` varchar(50) NOT NULL COMMENT '申请人userId',
  `preferredSegmentId` int NOT NULL COMMENT '希望跑的分段ID',
  `healthInfo` text NOT NULL COMMENT '健康状况(尤其是共患)',
  `occupation` varchar(100) DEFAULT NULL COMMENT '职业',
  `applicationReason` text NOT NULL COMMENT '申请理由',
  `status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending' COMMENT '审核状态',
  `reviewedBy` varchar(50) DEFAULT NULL COMMENT '审核人userId(队长)',
  `rejectionReason` text COMMENT '拒绝理由',
  `reviewedAt` datetime DEFAULT NULL COMMENT '审核时间',
  `cdatetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `udatetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`applicationId`),
  KEY `groupId` (`groupId`),
  KEY `userId` (`userId`),
  KEY `preferredSegmentId` (`preferredSegmentId`),
  KEY `reviewedBy` (`reviewedBy`),
  CONSTRAINT `tbl_group_application_ibfk_1` FOREIGN KEY (`groupId`) REFERENCES `tbl_group` (`groupId`) ON DELETE CASCADE,
  CONSTRAINT `tbl_group_application_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users_tbl` (`userId`) ON DELETE CASCADE,
  CONSTRAINT `tbl_group_application_ibfk_3` FOREIGN KEY (`preferredSegmentId`) REFERENCES `tbl_route_segment` (`segmentId`) ON DELETE CASCADE,
  CONSTRAINT `tbl_group_application_ibfk_4` FOREIGN KEY (`reviewedBy`) REFERENCES `users_tbl` (`userId`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='入队申请表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_group_application`
--

LOCK TABLES `tbl_group_application` WRITE;
/*!40000 ALTER TABLE `tbl_group_application` DISABLE KEYS */;
INSERT INTO `tbl_group_application` VALUES (1,4,'elle456',10,'none',NULL,'none','approved','elle123',NULL,'2025-11-30 12:07:42','2025-11-28 15:48:36','2025-11-30 12:07:42'),(2,4,'elle789',11,'none',NULL,'none','approved','elle123',NULL,'2025-11-30 12:07:36','2025-11-28 15:49:23','2025-11-30 12:07:36'),(3,3,'elle123456',8,'none','student','none','approved','elle123',NULL,'2025-11-30 12:10:26','2025-11-30 12:09:20','2025-11-30 12:10:26'),(4,5,'elle456',14,'none','none','///','pending',NULL,NULL,NULL,'2025-11-30 13:37:40','2025-11-30 13:37:40'),(5,7,'elle456',20,'none','student','none','approved','elle123',NULL,'2025-11-30 16:34:42','2025-11-30 16:31:01','2025-11-30 16:34:42'),(6,7,'elle789',21,'none','none','none','pending',NULL,NULL,NULL,'2025-11-30 16:36:27','2025-11-30 16:36:27'),(7,8,'elle789',24,'123','123','123','approved','elle123',NULL,'2025-11-30 18:35:33','2025-11-30 17:55:28','2025-11-30 18:35:33'),(8,8,'elle456',25,'n','n','n','approved','elle123',NULL,'2025-11-30 18:35:30','2025-11-30 18:34:59','2025-11-30 18:35:30');
/*!40000 ALTER TABLE `tbl_group_application` ENABLE KEYS */;
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
