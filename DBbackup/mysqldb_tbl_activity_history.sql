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
-- Table structure for table `tbl_activity_history`
--

DROP TABLE IF EXISTS `tbl_activity_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_activity_history` (
  `activityId` int NOT NULL AUTO_INCREMENT COMMENT '活动ID',
  `groupId` int NOT NULL COMMENT '队伍ID',
  `routeId` int NOT NULL COMMENT '路线ID',
  `scheduledDate` date NOT NULL COMMENT '计划日期',
  `scheduledTime` time NOT NULL COMMENT '计划开始时间',
  `actualStartTime` datetime DEFAULT NULL COMMENT '实际开始时间',
  `actualEndTime` datetime DEFAULT NULL COMMENT '实际结束时间',
  `status` enum('scheduled','ongoing','completed','cancelled') NOT NULL DEFAULT 'scheduled' COMMENT '活动状态',
  `participantCount` int NOT NULL DEFAULT '0' COMMENT '参与人数',
  `completionCount` int NOT NULL DEFAULT '0' COMMENT '完成人数',
  `notes` text COMMENT '备注',
  `cdatetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `udatetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`activityId`),
  KEY `groupId` (`groupId`),
  KEY `routeId` (`routeId`),
  CONSTRAINT `tbl_activity_history_ibfk_1` FOREIGN KEY (`groupId`) REFERENCES `tbl_group` (`groupId`) ON DELETE CASCADE,
  CONSTRAINT `tbl_activity_history_ibfk_2` FOREIGN KEY (`routeId`) REFERENCES `tbl_route` (`routeId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='活动历史表-每次跑步活动的整体记录';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_activity_history`
--

LOCK TABLES `tbl_activity_history` WRITE;
/*!40000 ALTER TABLE `tbl_activity_history` DISABLE KEYS */;
INSERT INTO `tbl_activity_history` VALUES (1,8,9,'2025-11-30','16:38:00','2025-11-30 18:35:53','2025-11-30 18:36:34','completed',3,0,NULL,'2025-11-30 18:35:53','2025-11-30 18:36:34'),(2,8,9,'2025-11-30','16:38:00','2025-11-30 18:47:37','2025-11-30 18:48:11','completed',3,0,NULL,'2025-11-30 18:47:37','2025-11-30 18:48:11'),(3,8,9,'2025-11-30','16:38:00','2025-11-30 18:50:20',NULL,'cancelled',3,0,NULL,'2025-11-30 18:50:20','2025-11-30 18:50:28'),(4,8,9,'2025-11-30','16:38:00','2025-11-30 18:50:32','2025-11-30 19:35:20','completed',3,0,NULL,'2025-11-30 18:50:32','2025-11-30 19:35:20'),(5,8,9,'2025-11-30','16:38:00','2025-11-30 19:35:26','2025-11-30 19:37:24','completed',3,0,NULL,'2025-11-30 19:35:26','2025-11-30 19:37:24'),(6,8,9,'2025-11-30','16:38:00','2025-11-30 19:37:32','2025-11-30 19:44:51','completed',3,0,NULL,'2025-11-30 19:37:32','2025-11-30 19:44:51'),(7,8,9,'2025-11-30','16:38:00','2025-11-30 19:45:01','2025-11-30 19:59:47','completed',3,0,NULL,'2025-11-30 19:45:01','2025-11-30 19:59:47'),(8,8,9,'2025-11-30','16:38:00','2025-11-30 20:04:08','2025-11-30 20:07:24','completed',3,0,NULL,'2025-11-30 20:04:08','2025-11-30 20:07:24');
/*!40000 ALTER TABLE `tbl_activity_history` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-30 20:52:52
