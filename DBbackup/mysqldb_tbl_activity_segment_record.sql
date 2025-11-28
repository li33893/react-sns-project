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
-- Table structure for table `tbl_activity_segment_record`
--

DROP TABLE IF EXISTS `tbl_activity_segment_record`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_activity_segment_record` (
  `recordId` int NOT NULL AUTO_INCREMENT COMMENT '记录ID',
  `activityId` int NOT NULL COMMENT '活动ID',
  `segmentId` int NOT NULL COMMENT '分段ID',
  `userId` varchar(50) NOT NULL COMMENT '跑步者userId',
  `relayFrom` varchar(50) DEFAULT NULL COMMENT '从谁那里接力(前一个跑者userId)',
  `actualStartTime` datetime DEFAULT NULL COMMENT '实际开始时间',
  `actualEndTime` datetime DEFAULT NULL COMMENT '实际结束时间',
  `actualDuration` int DEFAULT NULL COMMENT '实际用时(分钟)',
  `isOnTime` tinyint(1) DEFAULT NULL COMMENT '是否按时完成',
  `status` enum('waiting','running','completed','overtime','skipped') NOT NULL DEFAULT 'waiting' COMMENT '状态',
  `notes` text COMMENT '备注',
  `cdatetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `udatetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`recordId`),
  UNIQUE KEY `unique_activity_segment_user` (`activityId`,`segmentId`,`userId`),
  KEY `segmentId` (`segmentId`),
  KEY `userId` (`userId`),
  KEY `relayFrom` (`relayFrom`),
  CONSTRAINT `tbl_activity_segment_record_ibfk_1` FOREIGN KEY (`activityId`) REFERENCES `tbl_activity_history` (`activityId`) ON DELETE CASCADE,
  CONSTRAINT `tbl_activity_segment_record_ibfk_2` FOREIGN KEY (`segmentId`) REFERENCES `tbl_route_segment` (`segmentId`) ON DELETE CASCADE,
  CONSTRAINT `tbl_activity_segment_record_ibfk_3` FOREIGN KEY (`userId`) REFERENCES `users_tbl` (`userId`) ON DELETE CASCADE,
  CONSTRAINT `tbl_activity_segment_record_ibfk_4` FOREIGN KEY (`relayFrom`) REFERENCES `users_tbl` (`userId`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='分段完成记录表-记录每个人每段的实际表现';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_activity_segment_record`
--

LOCK TABLES `tbl_activity_segment_record` WRITE;
/*!40000 ALTER TABLE `tbl_activity_segment_record` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_activity_segment_record` ENABLE KEYS */;
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
