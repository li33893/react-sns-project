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
  `recordId` int NOT NULL AUTO_INCREMENT,
  `activityId` int NOT NULL,
  `segmentId` int NOT NULL,
  `userId` varchar(50) NOT NULL,
  `role` enum('main_runner','companion') NOT NULL COMMENT '主跑者或陪跑者',
  `relayFromUserId` varchar(50) DEFAULT NULL COMMENT '从谁接力过来',
  `personalDeadline` datetime DEFAULT NULL COMMENT '该用户在此段的个人DDL',
  `status` enum('waiting','running','completed','overtime','skipped') DEFAULT 'waiting',
  `actualStartTime` datetime DEFAULT NULL,
  `actualEndTime` datetime DEFAULT NULL,
  `actualDuration` int DEFAULT NULL COMMENT '实际用时(分钟)',
  `isOnTime` tinyint(1) DEFAULT NULL COMMENT '是否按时完成',
  `cdatetime` datetime DEFAULT NULL,
  `udatetime` datetime DEFAULT NULL,
  PRIMARY KEY (`recordId`),
  KEY `activityId` (`activityId`),
  KEY `segmentId` (`segmentId`),
  KEY `userId` (`userId`),
  CONSTRAINT `tbl_activity_segment_record_ibfk_1` FOREIGN KEY (`activityId`) REFERENCES `tbl_activity_history` (`activityId`),
  CONSTRAINT `tbl_activity_segment_record_ibfk_2` FOREIGN KEY (`segmentId`) REFERENCES `tbl_route_segment` (`segmentId`),
  CONSTRAINT `tbl_activity_segment_record_ibfk_3` FOREIGN KEY (`userId`) REFERENCES `users_tbl` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_activity_segment_record`
--

LOCK TABLES `tbl_activity_segment_record` WRITE;
/*!40000 ALTER TABLE `tbl_activity_segment_record` DISABLE KEYS */;
INSERT INTO `tbl_activity_segment_record` VALUES (1,1,23,'elle123','main_runner',NULL,'2025-11-30 18:36:53','completed','2025-11-30 18:35:53','2025-11-30 18:36:03',0,1,'2025-11-30 18:35:53','2025-11-30 18:36:03'),(2,1,24,'elle123','companion','elle123','2025-11-30 18:37:53','completed','2025-11-30 18:36:03','2025-11-30 18:36:15',0,1,'2025-11-30 18:35:53','2025-11-30 18:36:15'),(3,1,24,'elle789','main_runner','elle123','2025-11-30 18:37:53','completed','2025-11-30 18:36:03','2025-11-30 18:36:15',0,1,'2025-11-30 18:35:53','2025-11-30 18:36:15'),(4,1,25,'elle789','companion','elle789','2025-11-30 18:38:53','completed','2025-11-30 18:36:15','2025-11-30 18:36:22',0,1,'2025-11-30 18:35:53','2025-11-30 18:36:22'),(5,1,25,'elle456','main_runner','elle789','2025-11-30 18:38:53','completed','2025-11-30 18:36:15','2025-11-30 18:36:22',0,1,'2025-11-30 18:35:53','2025-11-30 18:36:22'),(6,1,26,'elle456','companion','elle456','2025-11-30 18:39:53','completed','2025-11-30 18:36:22','2025-11-30 18:36:34',0,1,'2025-11-30 18:35:53','2025-11-30 18:36:34'),(7,2,23,'elle123','main_runner',NULL,'2025-11-30 18:48:37','completed','2025-11-30 18:47:37','2025-11-30 18:47:48',0,1,'2025-11-30 18:47:37','2025-11-30 18:47:48'),(8,2,24,'elle123','companion','elle123','2025-11-30 18:49:37','completed','2025-11-30 18:47:48','2025-11-30 18:47:56',0,1,'2025-11-30 18:47:37','2025-11-30 18:47:56'),(9,2,24,'elle789','main_runner','elle123','2025-11-30 18:49:37','completed','2025-11-30 18:47:48','2025-11-30 18:47:56',0,1,'2025-11-30 18:47:37','2025-11-30 18:47:56'),(10,2,25,'elle789','companion','elle789','2025-11-30 18:50:37','completed','2025-11-30 18:47:56','2025-11-30 18:48:05',0,1,'2025-11-30 18:47:37','2025-11-30 18:48:05'),(11,2,25,'elle456','main_runner','elle789','2025-11-30 18:50:37','completed','2025-11-30 18:47:56','2025-11-30 18:48:05',0,1,'2025-11-30 18:47:37','2025-11-30 18:48:05'),(12,2,26,'elle456','companion','elle456','2025-11-30 18:51:37','completed','2025-11-30 18:48:05','2025-11-30 18:48:11',0,1,'2025-11-30 18:47:37','2025-11-30 18:48:11'),(13,3,23,'elle123','main_runner',NULL,'2025-11-30 18:51:20','running','2025-11-30 18:50:20',NULL,NULL,NULL,'2025-11-30 18:50:20','2025-11-30 18:50:20'),(14,3,24,'elle123','companion','elle123','2025-11-30 18:52:20','waiting',NULL,NULL,NULL,NULL,'2025-11-30 18:50:20','2025-11-30 18:50:20'),(15,3,24,'elle789','main_runner','elle123','2025-11-30 18:52:20','waiting',NULL,NULL,NULL,NULL,'2025-11-30 18:50:20','2025-11-30 18:50:20'),(16,3,25,'elle789','companion','elle789','2025-11-30 18:53:20','waiting',NULL,NULL,NULL,NULL,'2025-11-30 18:50:20','2025-11-30 18:50:20'),(17,3,25,'elle456','main_runner','elle789','2025-11-30 18:53:20','waiting',NULL,NULL,NULL,NULL,'2025-11-30 18:50:20','2025-11-30 18:50:20'),(18,3,26,'elle456','companion','elle456','2025-11-30 18:54:20','waiting',NULL,NULL,NULL,NULL,'2025-11-30 18:50:20','2025-11-30 18:50:20'),(19,4,23,'elle123','main_runner',NULL,'2025-11-30 18:51:32','completed','2025-11-30 18:50:32','2025-11-30 18:50:39',0,1,'2025-11-30 18:50:32','2025-11-30 18:50:39'),(20,4,24,'elle123','companion','elle123','2025-11-30 18:52:32','completed','2025-11-30 18:50:39','2025-11-30 18:52:28',1,1,'2025-11-30 18:50:32','2025-11-30 18:52:28'),(21,4,24,'elle789','main_runner','elle123','2025-11-30 18:52:32','completed','2025-11-30 18:50:39','2025-11-30 18:52:28',1,1,'2025-11-30 18:50:32','2025-11-30 18:52:28'),(22,4,25,'elle789','companion','elle789','2025-11-30 18:53:32','completed','2025-11-30 18:52:28','2025-11-30 18:53:11',0,1,'2025-11-30 18:50:32','2025-11-30 18:53:11'),(23,4,25,'elle456','main_runner','elle789','2025-11-30 18:53:32','completed','2025-11-30 18:52:28','2025-11-30 18:53:11',0,1,'2025-11-30 18:50:32','2025-11-30 18:53:11'),(24,4,26,'elle456','companion','elle456','2025-11-30 18:54:32','completed','2025-11-30 18:53:11','2025-11-30 19:35:20',42,0,'2025-11-30 18:50:32','2025-11-30 19:35:20'),(25,5,23,'elle123','main_runner',NULL,'2025-11-30 19:36:27','completed','2025-11-30 19:35:26','2025-11-30 19:35:35',0,1,'2025-11-30 19:35:26','2025-11-30 19:35:35'),(26,5,24,'elle123','companion','elle123','2025-11-30 19:37:27','completed','2025-11-30 19:35:35','2025-11-30 19:36:13',0,1,'2025-11-30 19:35:26','2025-11-30 19:36:13'),(27,5,24,'elle789','main_runner','elle123','2025-11-30 19:37:27','completed','2025-11-30 19:35:35','2025-11-30 19:36:13',0,1,'2025-11-30 19:35:26','2025-11-30 19:36:13'),(28,5,25,'elle789','companion','elle789','2025-11-30 19:38:27','completed','2025-11-30 19:36:13','2025-11-30 19:37:02',0,1,'2025-11-30 19:35:26','2025-11-30 19:37:02'),(29,5,25,'elle456','main_runner','elle789','2025-11-30 19:38:27','completed','2025-11-30 19:36:13','2025-11-30 19:37:02',0,1,'2025-11-30 19:35:26','2025-11-30 19:37:02'),(30,5,26,'elle456','companion','elle456','2025-11-30 19:39:27','completed','2025-11-30 19:37:02','2025-11-30 19:37:24',0,1,'2025-11-30 19:35:26','2025-11-30 19:37:24'),(31,6,23,'elle123','main_runner',NULL,'2025-11-30 19:38:33','completed','2025-11-30 19:37:32','2025-11-30 19:43:09',5,0,'2025-11-30 19:37:32','2025-11-30 19:43:09'),(32,6,24,'elle123','companion','elle123','2025-11-30 19:39:33','completed','2025-11-30 19:43:09','2025-11-30 19:43:41',0,0,'2025-11-30 19:37:32','2025-11-30 19:43:41'),(33,6,24,'elle789','main_runner','elle123','2025-11-30 19:39:33','completed','2025-11-30 19:43:09','2025-11-30 19:43:41',0,0,'2025-11-30 19:37:32','2025-11-30 19:43:41'),(34,6,25,'elle789','companion','elle789','2025-11-30 19:40:33','completed','2025-11-30 19:43:41','2025-11-30 19:44:06',0,0,'2025-11-30 19:37:32','2025-11-30 19:44:06'),(35,6,25,'elle456','main_runner','elle789','2025-11-30 19:40:33','completed','2025-11-30 19:43:41','2025-11-30 19:44:06',0,0,'2025-11-30 19:37:32','2025-11-30 19:44:06'),(36,6,26,'elle456','companion','elle456','2025-11-30 19:41:33','completed','2025-11-30 19:44:06','2025-11-30 19:44:51',0,0,'2025-11-30 19:37:32','2025-11-30 19:44:51'),(37,7,23,'elle123','main_runner',NULL,'2025-11-30 19:46:01','completed','2025-11-30 19:45:01','2025-11-30 19:45:48',0,1,'2025-11-30 19:45:01','2025-11-30 19:45:48'),(38,7,24,'elle123','companion','elle123','2025-11-30 19:47:01','completed','2025-11-30 19:45:48','2025-11-30 19:46:35',0,1,'2025-11-30 19:45:01','2025-11-30 19:46:35'),(39,7,24,'elle789','main_runner','elle123','2025-11-30 19:47:01','completed','2025-11-30 19:45:48','2025-11-30 19:46:35',0,1,'2025-11-30 19:45:01','2025-11-30 19:46:35'),(40,7,25,'elle789','companion','elle789','2025-11-30 19:48:01','completed','2025-11-30 19:46:35','2025-11-30 19:58:32',11,0,'2025-11-30 19:45:01','2025-11-30 19:58:32'),(41,7,25,'elle456','main_runner','elle789','2025-11-30 19:48:01','completed','2025-11-30 19:46:35','2025-11-30 19:58:32',11,0,'2025-11-30 19:45:01','2025-11-30 19:58:32'),(42,7,26,'elle456','companion','elle456','2025-11-30 19:49:01','completed','2025-11-30 19:58:32','2025-11-30 19:59:47',1,0,'2025-11-30 19:45:01','2025-11-30 19:59:47'),(43,8,23,'elle123','main_runner',NULL,'2025-11-30 20:05:09','completed','2025-11-30 20:04:08','2025-11-30 20:05:37',1,0,'2025-11-30 20:04:08','2025-11-30 20:05:37'),(44,8,24,'elle123','companion','elle123','2025-11-30 20:06:09','completed','2025-11-30 20:05:37','2025-11-30 20:06:25',0,0,'2025-11-30 20:04:08','2025-11-30 20:06:25'),(45,8,24,'elle789','main_runner','elle123','2025-11-30 20:06:09','completed','2025-11-30 20:05:37','2025-11-30 20:06:25',0,0,'2025-11-30 20:04:08','2025-11-30 20:06:25'),(46,8,25,'elle789','companion','elle789','2025-11-30 20:07:09','completed','2025-11-30 20:06:25','2025-11-30 20:07:04',0,1,'2025-11-30 20:04:08','2025-11-30 20:07:04'),(47,8,25,'elle456','main_runner','elle789','2025-11-30 20:07:09','completed','2025-11-30 20:06:25','2025-11-30 20:07:04',0,1,'2025-11-30 20:04:08','2025-11-30 20:07:04'),(48,8,26,'elle456','companion','elle456','2025-11-30 20:08:09','completed','2025-11-30 20:07:04','2025-11-30 20:07:24',0,1,'2025-11-30 20:04:08','2025-11-30 20:07:24');
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

-- Dump completed on 2025-11-30 20:52:54
