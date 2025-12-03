CREATE DATABASE  IF NOT EXISTS `mysqldb` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `mysqldb`;
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
  `activityId` int NOT NULL AUTO_INCREMENT,
  `groupId` int NOT NULL,
  `routeId` int NOT NULL,
  `scheduledDate` date DEFAULT NULL,
  `scheduledTime` time DEFAULT NULL,
  `actualStartTime` datetime DEFAULT NULL,
  `actualEndTime` datetime DEFAULT NULL,
  `status` enum('scheduled','ongoing','completed','cancelled') DEFAULT 'scheduled',
  `participantCount` int DEFAULT '0',
  `cdatetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `udatetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`activityId`),
  KEY `groupId` (`groupId`),
  KEY `routeId` (`routeId`),
  CONSTRAINT `tbl_activity_history_ibfk_1` FOREIGN KEY (`groupId`) REFERENCES `tbl_group` (`groupId`) ON DELETE CASCADE,
  CONSTRAINT `tbl_activity_history_ibfk_2` FOREIGN KEY (`routeId`) REFERENCES `tbl_route` (`routeId`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_activity_history`
--

LOCK TABLES `tbl_activity_history` WRITE;
/*!40000 ALTER TABLE `tbl_activity_history` DISABLE KEYS */;
INSERT INTO `tbl_activity_history` VALUES (1,1,1,'2025-12-01','15:27:00','2025-12-01 13:26:45','2025-12-01 13:27:24','completed',2,'2025-12-01 13:26:45','2025-12-01 13:27:24'),(2,3,3,'2025-12-01','04:15:00','2025-12-01 17:14:45','2025-12-01 17:15:42','completed',3,'2025-12-01 17:14:45','2025-12-01 17:15:42'),(3,3,3,'2025-12-02','04:15:00','2025-12-02 10:09:39','2025-12-02 10:09:54','completed',3,'2025-12-02 10:09:39','2025-12-02 10:09:54'),(4,3,3,'2025-12-02','04:15:00','2025-12-02 10:12:11','2025-12-02 10:12:46','completed',3,'2025-12-02 10:12:11','2025-12-02 10:12:46'),(5,3,3,'2025-12-02','04:15:00','2025-12-02 10:14:58','2025-12-02 10:15:14','completed',3,'2025-12-02 10:14:58','2025-12-02 10:15:14'),(6,3,3,'2025-12-02','04:15:00','2025-12-02 10:16:26','2025-12-02 10:16:50','completed',3,'2025-12-02 10:16:26','2025-12-02 10:16:50'),(7,3,3,'2025-12-02','04:15:00','2025-12-02 10:23:10','2025-12-02 10:41:38','completed',3,'2025-12-02 10:23:10','2025-12-02 10:41:38'),(8,3,3,'2025-12-02','04:15:00','2025-12-02 10:41:43','2025-12-02 10:41:54','completed',3,'2025-12-02 10:41:43','2025-12-02 10:41:54'),(9,3,3,'2025-12-02','04:15:00','2025-12-02 11:08:32','2025-12-02 11:08:56','completed',3,'2025-12-02 11:08:32','2025-12-02 11:08:56'),(10,3,3,'2025-12-02','04:15:00','2025-12-02 11:11:10','2025-12-02 11:11:38','completed',3,'2025-12-02 11:11:10','2025-12-02 11:11:38'),(11,3,3,'2025-12-02','04:15:00','2025-12-02 11:18:00','2025-12-02 11:18:14','completed',3,'2025-12-02 11:18:00','2025-12-02 11:18:14'),(12,3,3,'2025-12-02','04:15:00','2025-12-02 11:43:52','2025-12-02 11:44:11','completed',3,'2025-12-02 11:43:52','2025-12-02 11:44:11'),(13,3,3,'2025-12-02','04:15:00','2025-12-02 11:50:04','2025-12-02 11:50:19','completed',3,'2025-12-02 11:50:04','2025-12-02 11:50:19'),(14,3,3,'2025-12-02','04:15:00','2025-12-02 13:20:02','2025-12-02 13:20:53','completed',3,'2025-12-02 13:20:02','2025-12-02 13:20:53'),(15,5,5,'2025-12-02','05:00:00','2025-12-02 16:59:23','2025-12-02 17:02:23','completed',3,'2025-12-02 16:59:23','2025-12-02 17:02:23'),(16,6,6,'2025-12-03','05:36:00','2025-12-03 11:37:44','2025-12-03 11:38:26','completed',2,'2025-12-03 11:37:44','2025-12-03 11:38:26');
/*!40000 ALTER TABLE `tbl_activity_history` ENABLE KEYS */;
UNLOCK TABLES;

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
  `role` enum('main_runner','companion') NOT NULL DEFAULT 'main_runner',
  `relayFromUserId` varchar(50) DEFAULT NULL,
  `personalDeadline` datetime DEFAULT NULL,
  `actualStartTime` datetime DEFAULT NULL,
  `actualEndTime` datetime DEFAULT NULL,
  `actualDuration` int DEFAULT NULL,
  `isOnTime` tinyint(1) DEFAULT '1',
  `status` enum('waiting','running','completed','overtime','skipped') DEFAULT 'waiting',
  `cdatetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `udatetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`recordId`),
  KEY `activityId` (`activityId`),
  KEY `segmentId` (`segmentId`),
  KEY `userId` (`userId`),
  CONSTRAINT `tbl_activity_segment_record_ibfk_1` FOREIGN KEY (`activityId`) REFERENCES `tbl_activity_history` (`activityId`) ON DELETE CASCADE,
  CONSTRAINT `tbl_activity_segment_record_ibfk_2` FOREIGN KEY (`segmentId`) REFERENCES `tbl_route_segment` (`segmentId`),
  CONSTRAINT `tbl_activity_segment_record_ibfk_3` FOREIGN KEY (`userId`) REFERENCES `users_tbl` (`userId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=93 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_activity_segment_record`
--

LOCK TABLES `tbl_activity_segment_record` WRITE;
/*!40000 ALTER TABLE `tbl_activity_segment_record` DISABLE KEYS */;
INSERT INTO `tbl_activity_segment_record` VALUES (1,1,1,'elle123','main_runner',NULL,'2025-12-01 13:27:46','2025-12-01 13:26:45','2025-12-01 13:26:52',0,1,'completed','2025-12-01 13:26:45','2025-12-01 13:26:52'),(2,1,2,'elle123','companion','elle123','2025-12-01 13:28:46','2025-12-01 13:26:52','2025-12-01 13:27:18',0,1,'completed','2025-12-01 13:26:45','2025-12-01 13:27:18'),(3,1,2,'elle456','main_runner','elle123','2025-12-01 13:28:46','2025-12-01 13:26:52','2025-12-01 13:27:18',0,1,'completed','2025-12-01 13:26:45','2025-12-01 13:27:18'),(4,1,3,'elle456','companion','elle456','2025-12-01 13:29:46','2025-12-01 13:27:18','2025-12-01 13:27:24',0,1,'completed','2025-12-01 13:26:45','2025-12-01 13:27:24'),(5,2,5,'elle123','main_runner',NULL,'2025-12-01 17:15:46','2025-12-01 17:14:45','2025-12-01 17:15:30',0,1,'completed','2025-12-01 17:14:45','2025-12-01 17:15:30'),(6,2,6,'elle123','companion','elle123','2025-12-01 17:16:46','2025-12-01 17:15:30','2025-12-01 17:15:36',0,1,'completed','2025-12-01 17:14:45','2025-12-01 17:15:36'),(7,2,6,'elle456','main_runner','elle123','2025-12-01 17:16:46','2025-12-01 17:15:30','2025-12-01 17:15:36',0,1,'completed','2025-12-01 17:14:45','2025-12-01 17:15:36'),(8,2,7,'elle456','companion','elle456','2025-12-01 17:18:46','2025-12-01 17:15:36','2025-12-01 17:15:39',0,1,'completed','2025-12-01 17:14:45','2025-12-01 17:15:39'),(9,2,7,'elle789','main_runner','elle456','2025-12-01 17:18:46','2025-12-01 17:15:36','2025-12-01 17:15:39',0,1,'completed','2025-12-01 17:14:45','2025-12-01 17:15:39'),(10,2,8,'elle789','companion','elle789','2025-12-01 17:18:46','2025-12-01 17:15:39','2025-12-01 17:15:42',0,1,'completed','2025-12-01 17:14:45','2025-12-01 17:15:42'),(11,3,5,'elle123','main_runner',NULL,'2025-12-02 10:10:40','2025-12-02 10:09:39','2025-12-02 10:09:44',0,1,'completed','2025-12-02 10:09:39','2025-12-02 10:09:44'),(12,3,6,'elle123','companion','elle123','2025-12-02 10:11:40','2025-12-02 10:09:44','2025-12-02 10:09:47',0,1,'completed','2025-12-02 10:09:39','2025-12-02 10:09:47'),(13,3,6,'elle456','main_runner','elle123','2025-12-02 10:11:40','2025-12-02 10:09:44','2025-12-02 10:09:47',0,1,'completed','2025-12-02 10:09:39','2025-12-02 10:09:47'),(14,3,7,'elle456','companion','elle456','2025-12-02 10:13:40','2025-12-02 10:09:47','2025-12-02 10:09:50',0,1,'completed','2025-12-02 10:09:39','2025-12-02 10:09:50'),(15,3,7,'elle789','main_runner','elle456','2025-12-02 10:13:40','2025-12-02 10:09:47','2025-12-02 10:09:50',0,1,'completed','2025-12-02 10:09:39','2025-12-02 10:09:50'),(16,3,8,'elle789','companion','elle789','2025-12-02 10:13:40','2025-12-02 10:09:50','2025-12-02 10:09:54',0,1,'completed','2025-12-02 10:09:39','2025-12-02 10:09:54'),(17,4,5,'elle123','main_runner',NULL,'2025-12-02 10:13:11','2025-12-02 10:12:11','2025-12-02 10:12:16',0,1,'completed','2025-12-02 10:12:11','2025-12-02 10:12:16'),(18,4,6,'elle123','companion','elle123','2025-12-02 10:14:11','2025-12-02 10:12:16','2025-12-02 10:12:29',0,1,'completed','2025-12-02 10:12:11','2025-12-02 10:12:29'),(19,4,6,'elle456','main_runner','elle123','2025-12-02 10:14:11','2025-12-02 10:12:16','2025-12-02 10:12:29',0,1,'completed','2025-12-02 10:12:11','2025-12-02 10:12:29'),(20,4,7,'elle456','companion','elle456','2025-12-02 10:16:11','2025-12-02 10:12:29','2025-12-02 10:12:35',0,1,'completed','2025-12-02 10:12:11','2025-12-02 10:12:35'),(21,4,7,'elle789','main_runner','elle456','2025-12-02 10:16:11','2025-12-02 10:12:29','2025-12-02 10:12:35',0,1,'completed','2025-12-02 10:12:11','2025-12-02 10:12:35'),(22,4,8,'elle789','companion','elle789','2025-12-02 10:16:11','2025-12-02 10:12:35','2025-12-02 10:12:46',0,1,'completed','2025-12-02 10:12:11','2025-12-02 10:12:46'),(23,5,5,'elle123','main_runner',NULL,'2025-12-02 10:15:59','2025-12-02 10:14:58','2025-12-02 10:15:02',0,1,'completed','2025-12-02 10:14:58','2025-12-02 10:15:02'),(24,5,6,'elle123','companion','elle123','2025-12-02 10:16:59','2025-12-02 10:15:02','2025-12-02 10:15:08',0,1,'completed','2025-12-02 10:14:58','2025-12-02 10:15:08'),(25,5,6,'elle456','main_runner','elle123','2025-12-02 10:16:59','2025-12-02 10:15:02','2025-12-02 10:15:08',0,1,'completed','2025-12-02 10:14:58','2025-12-02 10:15:08'),(26,5,7,'elle456','companion','elle456','2025-12-02 10:18:59','2025-12-02 10:15:08','2025-12-02 10:15:11',0,1,'completed','2025-12-02 10:14:58','2025-12-02 10:15:11'),(27,5,7,'elle789','main_runner','elle456','2025-12-02 10:18:59','2025-12-02 10:15:08','2025-12-02 10:15:11',0,1,'completed','2025-12-02 10:14:58','2025-12-02 10:15:11'),(28,5,8,'elle789','companion','elle789','2025-12-02 10:18:59','2025-12-02 10:15:11','2025-12-02 10:15:14',0,1,'completed','2025-12-02 10:14:58','2025-12-02 10:15:14'),(29,6,5,'elle123','main_runner',NULL,'2025-12-02 10:17:26','2025-12-02 10:16:26','2025-12-02 10:16:31',0,1,'completed','2025-12-02 10:16:26','2025-12-02 10:16:31'),(30,6,6,'elle123','companion','elle123','2025-12-02 10:18:26','2025-12-02 10:16:31','2025-12-02 10:16:36',0,1,'completed','2025-12-02 10:16:26','2025-12-02 10:16:36'),(31,6,6,'elle456','main_runner','elle123','2025-12-02 10:18:26','2025-12-02 10:16:31','2025-12-02 10:16:36',0,1,'completed','2025-12-02 10:16:26','2025-12-02 10:16:36'),(32,6,7,'elle456','companion','elle456','2025-12-02 10:20:26','2025-12-02 10:16:36','2025-12-02 10:16:47',0,1,'completed','2025-12-02 10:16:26','2025-12-02 10:16:47'),(33,6,7,'elle789','main_runner','elle456','2025-12-02 10:20:26','2025-12-02 10:16:36','2025-12-02 10:16:47',0,1,'completed','2025-12-02 10:16:26','2025-12-02 10:16:47'),(34,6,8,'elle789','companion','elle789','2025-12-02 10:20:26','2025-12-02 10:16:47','2025-12-02 10:16:50',0,1,'completed','2025-12-02 10:16:26','2025-12-02 10:16:50'),(35,7,5,'elle123','main_runner',NULL,'2025-12-02 10:24:10','2025-12-02 10:23:10','2025-12-02 10:23:12',0,1,'completed','2025-12-02 10:23:10','2025-12-02 10:23:12'),(36,7,6,'elle123','companion','elle123','2025-12-02 10:25:10','2025-12-02 10:23:12','2025-12-02 10:23:15',0,1,'completed','2025-12-02 10:23:10','2025-12-02 10:23:15'),(37,7,6,'elle456','main_runner','elle123','2025-12-02 10:25:10','2025-12-02 10:23:12','2025-12-02 10:23:15',0,1,'completed','2025-12-02 10:23:10','2025-12-02 10:23:15'),(38,7,7,'elle456','companion','elle456','2025-12-02 10:27:10','2025-12-02 10:23:15','2025-12-02 10:23:17',0,1,'completed','2025-12-02 10:23:10','2025-12-02 10:23:17'),(39,7,7,'elle789','main_runner','elle456','2025-12-02 10:27:10','2025-12-02 10:23:15','2025-12-02 10:23:17',0,1,'completed','2025-12-02 10:23:10','2025-12-02 10:23:17'),(40,7,8,'elle789','companion','elle789','2025-12-02 10:27:10','2025-12-02 10:23:17','2025-12-02 10:41:38',18,0,'completed','2025-12-02 10:23:10','2025-12-02 10:41:38'),(41,8,5,'elle123','main_runner',NULL,'2025-12-02 10:42:43','2025-12-02 10:41:43','2025-12-02 10:41:46',0,1,'completed','2025-12-02 10:41:43','2025-12-02 10:41:46'),(42,8,6,'elle123','companion','elle123','2025-12-02 10:43:43','2025-12-02 10:41:46','2025-12-02 10:41:49',0,1,'completed','2025-12-02 10:41:43','2025-12-02 10:41:49'),(43,8,6,'elle456','main_runner','elle123','2025-12-02 10:43:43','2025-12-02 10:41:46','2025-12-02 10:41:49',0,1,'completed','2025-12-02 10:41:43','2025-12-02 10:41:49'),(44,8,7,'elle456','companion','elle456','2025-12-02 10:45:43','2025-12-02 10:41:49','2025-12-02 10:41:51',0,1,'completed','2025-12-02 10:41:43','2025-12-02 10:41:51'),(45,8,7,'elle789','main_runner','elle456','2025-12-02 10:45:43','2025-12-02 10:41:49','2025-12-02 10:41:51',0,1,'completed','2025-12-02 10:41:43','2025-12-02 10:41:51'),(46,8,8,'elle789','companion','elle789','2025-12-02 10:45:43','2025-12-02 10:41:51','2025-12-02 10:41:54',0,1,'completed','2025-12-02 10:41:43','2025-12-02 10:41:54'),(47,9,5,'elle123','main_runner',NULL,'2025-12-02 11:09:33','2025-12-02 11:08:32','2025-12-02 11:08:36',0,1,'completed','2025-12-02 11:08:32','2025-12-02 11:08:36'),(48,9,6,'elle123','companion','elle123','2025-12-02 11:10:33','2025-12-02 11:08:36','2025-12-02 11:08:40',0,1,'completed','2025-12-02 11:08:32','2025-12-02 11:08:40'),(49,9,6,'elle456','main_runner','elle123','2025-12-02 11:10:33','2025-12-02 11:08:36','2025-12-02 11:08:40',0,1,'completed','2025-12-02 11:08:32','2025-12-02 11:08:40'),(50,9,7,'elle456','companion','elle456','2025-12-02 11:12:33','2025-12-02 11:08:40','2025-12-02 11:08:51',0,1,'skipped','2025-12-02 11:08:32','2025-12-02 11:08:51'),(51,9,7,'elle789','main_runner','elle456','2025-12-02 11:12:33','2025-12-02 11:08:40','2025-12-02 11:08:51',0,1,'skipped','2025-12-02 11:08:32','2025-12-02 11:08:51'),(52,9,8,'elle789','companion','elle789','2025-12-02 11:12:33','2025-12-02 11:08:51','2025-12-02 11:08:56',0,1,'skipped','2025-12-02 11:08:32','2025-12-02 11:08:56'),(53,10,5,'elle123','main_runner',NULL,'2025-12-02 11:12:10','2025-12-02 11:11:10','2025-12-02 11:11:14',0,1,'completed','2025-12-02 11:11:10','2025-12-02 11:11:14'),(54,10,6,'elle123','companion','elle123','2025-12-02 11:13:10','2025-12-02 11:11:14','2025-12-02 11:11:23',0,1,'completed','2025-12-02 11:11:10','2025-12-02 11:11:23'),(55,10,6,'elle456','main_runner','elle123','2025-12-02 11:13:10','2025-12-02 11:11:14','2025-12-02 11:11:23',0,1,'completed','2025-12-02 11:11:10','2025-12-02 11:11:23'),(56,10,7,'elle456','companion','elle456','2025-12-02 11:15:10','2025-12-02 11:11:23','2025-12-02 11:11:31',0,1,'skipped','2025-12-02 11:11:10','2025-12-02 11:11:31'),(57,10,7,'elle789','main_runner','elle456','2025-12-02 11:15:10','2025-12-02 11:11:23','2025-12-02 11:11:31',0,1,'skipped','2025-12-02 11:11:10','2025-12-02 11:11:31'),(58,10,8,'elle789','companion','elle789','2025-12-02 11:15:10','2025-12-02 11:11:31','2025-12-02 11:11:38',0,1,'skipped','2025-12-02 11:11:10','2025-12-02 11:11:38'),(59,11,5,'elle123','main_runner',NULL,'2025-12-02 11:19:01','2025-12-02 11:18:00','2025-12-02 11:18:03',0,1,'completed','2025-12-02 11:18:00','2025-12-02 11:18:03'),(60,11,6,'elle123','companion','elle123','2025-12-02 11:20:01','2025-12-02 11:18:03','2025-12-02 11:18:06',0,1,'completed','2025-12-02 11:18:00','2025-12-02 11:18:06'),(61,11,6,'elle456','main_runner','elle123','2025-12-02 11:20:01','2025-12-02 11:18:03','2025-12-02 11:18:06',0,1,'completed','2025-12-02 11:18:00','2025-12-02 11:18:06'),(62,11,7,'elle456','companion','elle456','2025-12-02 11:22:01','2025-12-02 11:18:06','2025-12-02 11:18:10',0,1,'skipped','2025-12-02 11:18:00','2025-12-02 11:18:10'),(63,11,7,'elle789','main_runner','elle456','2025-12-02 11:22:01','2025-12-02 11:18:06','2025-12-02 11:18:10',0,1,'skipped','2025-12-02 11:18:00','2025-12-02 11:18:10'),(64,11,8,'elle789','companion','elle789','2025-12-02 11:22:01','2025-12-02 11:18:10','2025-12-02 11:18:14',0,1,'skipped','2025-12-02 11:18:00','2025-12-02 11:18:14'),(65,12,5,'elle123','main_runner',NULL,'2025-12-02 11:44:52','2025-12-02 11:43:52','2025-12-02 11:43:56',0,1,'completed','2025-12-02 11:43:52','2025-12-02 11:43:56'),(66,12,6,'elle123','companion','elle123','2025-12-02 11:45:52','2025-12-02 11:43:56','2025-12-02 11:43:59',0,1,'completed','2025-12-02 11:43:52','2025-12-02 11:43:59'),(67,12,6,'elle456','main_runner','elle123','2025-12-02 11:45:52','2025-12-02 11:43:56','2025-12-02 11:43:59',0,1,'completed','2025-12-02 11:43:52','2025-12-02 11:43:59'),(68,12,7,'elle456','companion','elle456','2025-12-02 11:47:52','2025-12-02 11:43:59','2025-12-02 11:44:08',0,0,'skipped','2025-12-02 11:43:52','2025-12-02 11:44:08'),(69,12,7,'elle789','main_runner','elle456','2025-12-02 11:47:52','2025-12-02 11:43:59','2025-12-02 11:44:08',0,0,'skipped','2025-12-02 11:43:52','2025-12-02 11:44:08'),(70,12,8,'elle789','companion','elle789','2025-12-02 11:47:52','2025-12-02 11:44:08','2025-12-02 11:44:11',0,0,'skipped','2025-12-02 11:43:52','2025-12-02 11:44:11'),(71,13,5,'elle123','main_runner',NULL,'2025-12-02 11:51:05','2025-12-02 11:50:04','2025-12-02 11:50:10',0,1,'completed','2025-12-02 11:50:04','2025-12-02 11:50:10'),(72,13,6,'elle123','companion','elle123','2025-12-02 11:52:05','2025-12-02 11:50:10','2025-12-02 11:50:13',0,1,'completed','2025-12-02 11:50:04','2025-12-02 11:50:13'),(73,13,6,'elle456','main_runner','elle123','2025-12-02 11:52:05','2025-12-02 11:50:10','2025-12-02 11:50:13',0,1,'completed','2025-12-02 11:50:04','2025-12-02 11:50:13'),(74,13,7,'elle456','companion','elle456','2025-12-02 11:54:05','2025-12-02 11:50:13','2025-12-02 11:50:15',0,0,'skipped','2025-12-02 11:50:04','2025-12-02 11:50:15'),(75,13,7,'elle789','main_runner','elle456','2025-12-02 11:54:05','2025-12-02 11:50:13','2025-12-02 11:50:15',0,0,'skipped','2025-12-02 11:50:04','2025-12-02 11:50:15'),(76,13,8,'elle789','companion','elle789','2025-12-02 11:54:05','2025-12-02 11:50:15','2025-12-02 11:50:19',0,0,'skipped','2025-12-02 11:50:04','2025-12-02 11:50:19'),(77,14,5,'elle123','main_runner',NULL,'2025-12-02 13:21:02','2025-12-02 13:20:02','2025-12-02 13:20:44',0,1,'completed','2025-12-02 13:20:02','2025-12-02 13:20:44'),(78,14,6,'elle123','companion','elle123','2025-12-02 13:22:02','2025-12-02 13:20:44','2025-12-02 13:20:48',0,1,'completed','2025-12-02 13:20:02','2025-12-02 13:20:48'),(79,14,6,'elle456','main_runner','elle123','2025-12-02 13:22:02','2025-12-02 13:20:44','2025-12-02 13:20:48',0,1,'completed','2025-12-02 13:20:02','2025-12-02 13:20:48'),(80,14,7,'elle456','companion','elle456','2025-12-02 13:24:02','2025-12-02 13:20:48','2025-12-02 13:20:51',0,0,'skipped','2025-12-02 13:20:02','2025-12-02 13:20:51'),(81,14,7,'elle789','main_runner','elle456','2025-12-02 13:24:02','2025-12-02 13:20:48','2025-12-02 13:20:51',0,0,'skipped','2025-12-02 13:20:02','2025-12-02 13:20:51'),(82,14,8,'elle789','companion','elle789','2025-12-02 13:24:02','2025-12-02 13:20:51','2025-12-02 13:20:53',0,0,'skipped','2025-12-02 13:20:02','2025-12-02 13:20:53'),(83,15,10,'me','main_runner',NULL,'2025-12-02 17:04:23','2025-12-02 16:59:23','2025-12-02 17:00:03',0,1,'completed','2025-12-02 16:59:23','2025-12-02 17:00:03'),(84,15,11,'me','companion','me','2025-12-02 17:11:23','2025-12-02 17:00:03','2025-12-02 17:00:58',0,1,'completed','2025-12-02 16:59:23','2025-12-02 17:00:58'),(85,15,11,'Aaa','main_runner','me','2025-12-02 17:11:23','2025-12-02 17:00:03','2025-12-02 17:00:58',0,1,'completed','2025-12-02 16:59:23','2025-12-02 17:00:58'),(86,15,12,'Aaa','companion','Aaa','2025-12-02 17:18:23','2025-12-02 17:00:58','2025-12-02 17:01:16',0,1,'completed','2025-12-02 16:59:23','2025-12-02 17:01:16'),(87,15,12,'Bbb','main_runner','Aaa','2025-12-02 17:18:23','2025-12-02 17:00:58','2025-12-02 17:01:16',0,1,'completed','2025-12-02 16:59:23','2025-12-02 17:01:16'),(88,15,13,'Bbb','companion','Bbb','2025-12-02 17:23:23','2025-12-02 17:01:16','2025-12-02 17:02:23',1,0,'skipped','2025-12-02 16:59:23','2025-12-02 17:02:23'),(89,16,14,'Aaa','main_runner',NULL,'2025-12-03 11:40:44','2025-12-03 11:37:44','2025-12-03 11:37:49',0,1,'completed','2025-12-03 11:37:44','2025-12-03 11:37:49'),(90,16,15,'Aaa','companion','Aaa','2025-12-03 11:43:44','2025-12-03 11:37:49','2025-12-03 11:38:23',0,1,'completed','2025-12-03 11:37:44','2025-12-03 11:38:23'),(91,16,15,'Bbb','main_runner','Aaa','2025-12-03 11:43:44','2025-12-03 11:37:49','2025-12-03 11:38:23',0,1,'completed','2025-12-03 11:37:44','2025-12-03 11:38:23'),(92,16,16,'Bbb','companion','Bbb','2025-12-03 11:46:44','2025-12-03 11:38:23','2025-12-03 11:38:26',0,1,'completed','2025-12-03 11:37:44','2025-12-03 11:38:26');
/*!40000 ALTER TABLE `tbl_activity_segment_record` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_chat_member`
--

DROP TABLE IF EXISTS `tbl_chat_member`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_chat_member` (
  `chatMemberId` int NOT NULL AUTO_INCREMENT,
  `roomId` int NOT NULL,
  `userId` varchar(50) NOT NULL,
  `joinedAt` datetime DEFAULT NULL,
  `lastReadAt` datetime DEFAULT NULL COMMENT '最后阅读时间',
  `cdatetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`chatMemberId`),
  KEY `roomId` (`roomId`),
  KEY `userId` (`userId`),
  CONSTRAINT `tbl_chat_member_ibfk_1` FOREIGN KEY (`roomId`) REFERENCES `tbl_chat_room` (`roomId`) ON DELETE CASCADE,
  CONSTRAINT `tbl_chat_member_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users_tbl` (`userId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_chat_member`
--

LOCK TABLES `tbl_chat_member` WRITE;
/*!40000 ALTER TABLE `tbl_chat_member` DISABLE KEYS */;
INSERT INTO `tbl_chat_member` VALUES (1,1,'elle123','2025-12-01 13:24:47','2025-12-02 09:50:11','2025-12-01 13:24:47'),(2,1,'elle456','2025-12-01 13:26:35',NULL,'2025-12-01 13:26:35'),(3,2,'elle123','2025-12-01 13:41:42','2025-12-02 09:50:13','2025-12-01 13:41:42'),(4,3,'elle123','2025-12-01 14:16:05','2025-12-02 09:55:20','2025-12-01 14:16:05'),(5,3,'elle789','2025-12-01 14:18:13','2025-12-02 10:42:51','2025-12-01 14:18:13'),(6,3,'elle456','2025-12-01 14:18:17','2025-12-01 14:30:36','2025-12-01 14:18:17'),(7,4,'elle123','2025-12-01 14:36:37','2025-12-02 09:53:34','2025-12-01 14:36:37'),(8,4,'elle456','2025-12-01 14:36:37','2025-12-01 16:10:42','2025-12-01 14:36:37'),(9,5,'elle123','2025-12-02 09:55:09','2025-12-02 09:55:09','2025-12-02 09:55:09'),(10,5,'elle123456','2025-12-02 09:55:09',NULL,'2025-12-02 09:55:09'),(11,6,'me','2025-12-02 16:00:35','2025-12-03 11:49:57','2025-12-02 16:00:35'),(12,7,'me','2025-12-02 16:11:43','2025-12-03 11:50:08','2025-12-02 16:11:43'),(13,7,'Aaa','2025-12-02 16:40:25','2025-12-02 17:40:08','2025-12-02 16:40:25'),(14,7,'Bbb','2025-12-02 16:58:16','2025-12-02 18:19:04','2025-12-02 16:58:16'),(15,8,'me','2025-12-02 17:52:40','2025-12-02 17:52:59','2025-12-02 17:52:40'),(16,8,'Bbb','2025-12-02 17:52:40','2025-12-02 18:18:59','2025-12-02 17:52:40'),(17,9,'Aaa','2025-12-03 11:36:33',NULL,'2025-12-03 11:36:33'),(18,9,'Bbb','2025-12-03 11:37:35',NULL,'2025-12-03 11:37:35');
/*!40000 ALTER TABLE `tbl_chat_member` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_chat_message`
--

DROP TABLE IF EXISTS `tbl_chat_message`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_chat_message` (
  `messageId` int NOT NULL AUTO_INCREMENT COMMENT '消息ID',
  `roomId` int NOT NULL COMMENT '聊天室ID',
  `senderId` varchar(50) NOT NULL COMMENT '发送者userId',
  `messageType` enum('text','image','system') NOT NULL DEFAULT 'text' COMMENT '消息类型',
  `content` text NOT NULL COMMENT '消息内容',
  `cdatetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`messageId`),
  KEY `roomId` (`roomId`),
  KEY `senderId` (`senderId`),
  CONSTRAINT `tbl_chat_message_ibfk_1` FOREIGN KEY (`roomId`) REFERENCES `tbl_chat_room` (`roomId`) ON DELETE CASCADE,
  CONSTRAINT `tbl_chat_message_ibfk_2` FOREIGN KEY (`senderId`) REFERENCES `users_tbl` (`userId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='聊天消息表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_chat_message`
--

LOCK TABLES `tbl_chat_message` WRITE;
/*!40000 ALTER TABLE `tbl_chat_message` DISABLE KEYS */;
INSERT INTO `tbl_chat_message` VALUES (1,3,'elle123','image','http://localhost:3010/uploads/chat/1764567014654-ä½äº.webp','2025-12-01 14:30:14'),(2,3,'elle123','text','fkdjflksjd','2025-12-01 14:30:17'),(3,4,'elle123','image','http://localhost:3010/uploads/chat/1764567401350-åæ­£åæ²¡äººè®°å¾ä½ ççæ¥.webp','2025-12-01 14:36:41'),(4,4,'elle123','text','hello','2025-12-01 14:36:45'),(5,7,'me','image','http://localhost:3010/uploads/chat/1764664561644-åæ­£åæ²¡äººè®°å¾ä½ ççæ¥.webp','2025-12-02 17:36:01'),(6,7,'me','text','오늘 길이 별로였어요.','2025-12-02 17:37:05'),(7,7,'Bbb','text','그쵸, 모기가 참 많았어요ㅠㅠ','2025-12-02 17:38:25'),(8,7,'Aaa','text','만물에는 영혼이 있다. 모기만 빼고.','2025-12-02 17:40:08'),(9,8,'me','image','http://localhost:3010/uploads/chat/1764665577365-ç.webp','2025-12-02 17:52:57'),(10,8,'me','text','hi!!!','2025-12-02 17:52:59'),(11,7,'me','text','+1','2025-12-03 11:50:08');
/*!40000 ALTER TABLE `tbl_chat_message` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_chat_room`
--

DROP TABLE IF EXISTS `tbl_chat_room`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_chat_room` (
  `roomId` int NOT NULL AUTO_INCREMENT,
  `roomType` enum('group','private') NOT NULL COMMENT '聊天室类型',
  `roomName` varchar(100) DEFAULT NULL,
  `relatedGroupId` int DEFAULT NULL,
  `cdatetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `udatetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`roomId`),
  KEY `relatedGroupId` (`relatedGroupId`),
  CONSTRAINT `tbl_chat_room_ibfk_1` FOREIGN KEY (`relatedGroupId`) REFERENCES `tbl_group` (`groupId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_chat_room`
--

LOCK TABLES `tbl_chat_room` WRITE;
/*!40000 ALTER TABLE `tbl_chat_room` DISABLE KEYS */;
INSERT INTO `tbl_chat_room` VALUES (1,'group','孩子都要哭了 그룹채팅',1,'2025-12-01 13:24:47','2025-12-01 13:24:47'),(2,'group','111 그룹채팅',2,'2025-12-01 13:41:42','2025-12-01 13:41:42'),(3,'group','孩子要疯了 그룹채팅',3,'2025-12-01 14:16:05','2025-12-01 14:16:05'),(4,'private',NULL,NULL,'2025-12-01 14:36:37','2025-12-01 14:36:37'),(5,'private',NULL,NULL,'2025-12-02 09:55:08','2025-12-02 09:55:08'),(6,'group','1 그룹채팅',4,'2025-12-02 16:00:35','2025-12-02 16:00:35'),(7,'group','서초런닝팀 그룹채팅',5,'2025-12-02 16:11:43','2025-12-02 16:11:43'),(8,'private',NULL,NULL,'2025-12-02 17:52:40','2025-12-02 17:52:40'),(9,'group','1231 그룹채팅',6,'2025-12-03 11:36:33','2025-12-03 11:36:33');
/*!40000 ALTER TABLE `tbl_chat_room` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_comment`
--

DROP TABLE IF EXISTS `tbl_comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_comment` (
  `commentId` int NOT NULL AUTO_INCREMENT,
  `feedId` int NOT NULL,
  `userId` varchar(50) NOT NULL,
  `content` text NOT NULL,
  `cdatetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `replyToUserId` varchar(50) DEFAULT NULL,
  `replyToNickname` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`commentId`),
  KEY `feedId` (`feedId`),
  KEY `userId` (`userId`),
  CONSTRAINT `tbl_comment_ibfk_1` FOREIGN KEY (`feedId`) REFERENCES `tbl_feed` (`feedId`) ON DELETE CASCADE,
  CONSTRAINT `tbl_comment_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users_tbl` (`userId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_comment`
--

LOCK TABLES `tbl_comment` WRITE;
/*!40000 ALTER TABLE `tbl_comment` DISABLE KEYS */;
INSERT INTO `tbl_comment` VALUES (11,6,'me','또 만납시다!!!!','2025-12-02 18:06:23',NULL,NULL),(12,6,'Aaa','@나  또 만납시다!!!!','2025-12-02 18:07:15','me','나'),(13,9,'Bbb','ㅠㅠ','2025-12-03 11:41:40',NULL,NULL);
/*!40000 ALTER TABLE `tbl_comment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_feed`
--

DROP TABLE IF EXISTS `tbl_feed`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_feed` (
  `feedId` int NOT NULL AUTO_INCREMENT,
  `userId` varchar(50) NOT NULL,
  `feedType` enum('group','daily','vent') NOT NULL DEFAULT 'daily',
  `title` varchar(200) DEFAULT NULL,
  `groupId` int DEFAULT NULL,
  `routeId` int DEFAULT NULL,
  `historyId` int DEFAULT NULL,
  `location` varchar(100) DEFAULT NULL,
  `content` text NOT NULL,
  `likeCnt` int NOT NULL DEFAULT '0',
  `favorCnt` int NOT NULL DEFAULT '0',
  `commentCnt` int NOT NULL DEFAULT '0',
  `isAnonymous` tinyint(1) NOT NULL DEFAULT '0',
  `cdatetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `udatetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`feedId`),
  KEY `userId` (`userId`),
  CONSTRAINT `tbl_feed_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users_tbl` (`userId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_feed`
--

LOCK TABLES `tbl_feed` WRITE;
/*!40000 ALTER TABLE `tbl_feed` DISABLE KEYS */;
INSERT INTO `tbl_feed` VALUES (6,'me','group','모기에게 먹혀도 즐거웠습니다.',5,5,15,'서초구','Aaa씨 다음에 또 만납시다!!!!~',1,2,2,0,'2025-12-02 17:59:34','2025-12-03 11:41:21'),(7,'me','vent','생일을 비번으로 하는게 실은 아주 안전해.',NULL,NULL,NULL,NULL,'나만 빼고 누가 그걸 기억하니',0,0,0,1,'2025-12-02 18:11:35','2025-12-02 18:11:35'),(9,'Bbb','group','못 다 뛰었지만 ㅠㅠ',5,5,15,'서초구','다음에 잘 할게ㅠㅠ',1,0,1,0,'2025-12-02 18:17:50','2025-12-03 11:41:40');
/*!40000 ALTER TABLE `tbl_feed` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_feed_favorite`
--

DROP TABLE IF EXISTS `tbl_feed_favorite`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_feed_favorite` (
  `favorId` int NOT NULL AUTO_INCREMENT,
  `feedId` int NOT NULL,
  `userId` varchar(50) NOT NULL,
  `cdatetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`favorId`),
  UNIQUE KEY `unique_favorite` (`feedId`,`userId`),
  KEY `userId` (`userId`),
  CONSTRAINT `tbl_feed_favorite_ibfk_1` FOREIGN KEY (`feedId`) REFERENCES `tbl_feed` (`feedId`) ON DELETE CASCADE,
  CONSTRAINT `tbl_feed_favorite_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users_tbl` (`userId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_feed_favorite`
--

LOCK TABLES `tbl_feed_favorite` WRITE;
/*!40000 ALTER TABLE `tbl_feed_favorite` DISABLE KEYS */;
INSERT INTO `tbl_feed_favorite` VALUES (2,6,'me','2025-12-03 09:38:49'),(3,6,'Bbb','2025-12-03 11:41:21');
/*!40000 ALTER TABLE `tbl_feed_favorite` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_feed_img`
--

DROP TABLE IF EXISTS `tbl_feed_img`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_feed_img` (
  `imgId` int NOT NULL AUTO_INCREMENT,
  `feedId` int NOT NULL,
  `fileName` varchar(255) NOT NULL,
  `filePath` varchar(500) NOT NULL,
  `is_thumbnail` tinyint(1) NOT NULL DEFAULT '0',
  `cdatetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `udatetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`imgId`),
  KEY `feedId` (`feedId`),
  CONSTRAINT `tbl_feed_img_ibfk_1` FOREIGN KEY (`feedId`) REFERENCES `tbl_feed` (`feedId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_feed_img`
--

LOCK TABLES `tbl_feed_img` WRITE;
/*!40000 ALTER TABLE `tbl_feed_img` DISABLE KEYS */;
INSERT INTO `tbl_feed_img` VALUES (13,10,'1764224016342-è¯¥æ­»çå¦æå¶äºº.webp','http://localhost:3010/uploads/1764224016342-è¯¥æ­»çå¦æå¶äºº.webp',1,'2025-11-27 15:13:36','2025-11-27 15:13:36'),(14,11,'1764224270565-åæ´»äºä¸å¤©.webp','http://localhost:3010/uploads/1764224270565-åæ´»äºä¸å¤©.webp',1,'2025-11-27 15:17:50','2025-11-27 15:17:50'),(15,11,'1764224270565-è¯¥æ­»çå¦æå¶äºº.webp','http://localhost:3010/uploads/1764224270565-è¯¥æ­»çå¦æå¶äºº.webp',0,'2025-11-27 15:17:50','2025-11-27 15:17:50'),(16,12,'1764235194444-è.webp','http://localhost:3010/uploads/1764235194444-è.webp',1,'2025-11-27 18:19:54','2025-11-27 18:19:54'),(17,12,'1764235194445-ç.webp','http://localhost:3010/uploads/1764235194445-ç.webp',0,'2025-11-27 18:19:54','2025-11-27 18:19:54'),(18,13,'1764288627060-åæ­£åæ²¡äººè®°å¾ä½ ççæ¥.webp','http://localhost:3010/uploads/1764288627060-åæ­£åæ²¡äººè®°å¾ä½ ççæ¥.webp',1,'2025-11-28 09:10:27','2025-11-28 09:10:27'),(25,6,'1764665974176-è¯¥æ­»çå¦æå¶äºº.webp','http://localhost:3010/uploads/1764665974176-è¯¥æ­»çå¦æå¶äºº.webp',1,'2025-12-02 17:59:34','2025-12-02 17:59:34'),(26,7,'1764666695454-åæ­£åæ²¡äººè®°å¾ä½ ççæ¥.webp','http://localhost:3010/uploads/1764666695454-åæ­£åæ²¡äººè®°å¾ä½ ççæ¥.webp',1,'2025-12-02 18:11:35','2025-12-02 18:11:35'),(29,9,'1764667070898-ä½äº.webp','http://localhost:3010/uploads/1764667070898-ä½äº.webp',1,'2025-12-02 18:17:50','2025-12-02 18:17:50'),(30,9,'1764667070898-è.webp','http://localhost:3010/uploads/1764667070898-è.webp',0,'2025-12-02 18:17:50','2025-12-02 18:17:50');
/*!40000 ALTER TABLE `tbl_feed_img` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_feed_like`
--

DROP TABLE IF EXISTS `tbl_feed_like`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_feed_like` (
  `likeId` int NOT NULL AUTO_INCREMENT,
  `feedId` int NOT NULL,
  `userId` varchar(50) NOT NULL,
  `cdatetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`likeId`),
  UNIQUE KEY `unique_like` (`feedId`,`userId`),
  KEY `userId` (`userId`),
  CONSTRAINT `tbl_feed_like_ibfk_1` FOREIGN KEY (`feedId`) REFERENCES `tbl_feed` (`feedId`) ON DELETE CASCADE,
  CONSTRAINT `tbl_feed_like_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users_tbl` (`userId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_feed_like`
--

LOCK TABLES `tbl_feed_like` WRITE;
/*!40000 ALTER TABLE `tbl_feed_like` DISABLE KEYS */;
INSERT INTO `tbl_feed_like` VALUES (4,6,'Bbb','2025-12-03 11:41:20'),(5,9,'Bbb','2025-12-03 11:41:23');
/*!40000 ALTER TABLE `tbl_feed_like` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_follow`
--

DROP TABLE IF EXISTS `tbl_follow`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_follow` (
  `followId` int NOT NULL AUTO_INCREMENT,
  `follower_no` varchar(50) NOT NULL,
  `following_no` varchar(50) NOT NULL,
  `cdatetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`followId`),
  UNIQUE KEY `unique_follow` (`follower_no`,`following_no`),
  KEY `following_no` (`following_no`),
  CONSTRAINT `tbl_follow_ibfk_1` FOREIGN KEY (`follower_no`) REFERENCES `users_tbl` (`userId`) ON DELETE CASCADE,
  CONSTRAINT `tbl_follow_ibfk_2` FOREIGN KEY (`following_no`) REFERENCES `users_tbl` (`userId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_follow`
--

LOCK TABLES `tbl_follow` WRITE;
/*!40000 ALTER TABLE `tbl_follow` DISABLE KEYS */;
INSERT INTO `tbl_follow` VALUES (1,'elle456','elle123','2025-12-01 14:31:03'),(3,'elle123','elle456','2025-12-02 11:54:44'),(4,'me','Bbb','2025-12-02 17:52:07'),(5,'Bbb','me','2025-12-02 18:12:50'),(6,'me','Aaa','2025-12-03 09:38:36'),(7,'Aaa','me','2025-12-03 11:35:19');
/*!40000 ALTER TABLE `tbl_follow` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_group`
--

DROP TABLE IF EXISTS `tbl_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_group` (
  `groupId` int NOT NULL AUTO_INCREMENT,
  `groupName` varchar(100) NOT NULL,
  `routeId` int NOT NULL,
  `leaderId` varchar(50) NOT NULL,
  `district` varchar(50) DEFAULT NULL,
  `scheduleType` enum('weekly','biweekly','monthly') DEFAULT 'weekly',
  `weekDays` json DEFAULT NULL,
  `startTime` time DEFAULT NULL,
  `maxMembers` int DEFAULT '10',
  `currentMembers` int DEFAULT '0',
  `status` enum('recruiting','full','active','inactive') DEFAULT 'recruiting',
  `description` text,
  `cdatetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `udatetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`groupId`),
  KEY `routeId` (`routeId`),
  KEY `leaderId` (`leaderId`),
  CONSTRAINT `tbl_group_ibfk_1` FOREIGN KEY (`routeId`) REFERENCES `tbl_route` (`routeId`),
  CONSTRAINT `tbl_group_ibfk_2` FOREIGN KEY (`leaderId`) REFERENCES `users_tbl` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_group`
--

LOCK TABLES `tbl_group` WRITE;
/*!40000 ALTER TABLE `tbl_group` DISABLE KEYS */;
INSERT INTO `tbl_group` VALUES (1,'孩子都要哭了',1,'elle123','서초구','weekly','[\"1\", \"3\", \"5\"]','15:27:00',2,2,'full',NULL,'2025-12-01 13:24:47','2025-12-01 13:26:35'),(2,'111',2,'elle123','강남구','weekly','[\"0\", \"1\", \"2\", \"4\"]','14:42:00',0,1,'recruiting',NULL,'2025-12-01 13:41:42','2025-12-01 13:41:42'),(3,'孩子要疯了',3,'elle123','서초구','weekly','[\"1\", \"3\", \"5\"]','04:15:00',3,3,'full','123','2025-12-01 14:16:05','2025-12-01 14:18:17'),(4,'1',4,'me','서초구','weekly','[\"6\"]','18:00:00',0,1,'recruiting','1','2025-12-02 16:00:35','2025-12-02 16:00:35'),(5,'서초런닝팀',5,'me','서초구','weekly','[\"1\", \"3\", \"5\"]','05:00:00',3,3,'full','welcome!!!!','2025-12-02 16:11:43','2025-12-02 16:58:16'),(6,'1231',6,'Aaa','서초구','weekly','[\"0\", \"2\", \"6\"]','05:36:00',2,2,'full','1231321321','2025-12-03 11:36:33','2025-12-03 11:37:35');
/*!40000 ALTER TABLE `tbl_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_group_application`
--

DROP TABLE IF EXISTS `tbl_group_application`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_group_application` (
  `applicationId` int NOT NULL AUTO_INCREMENT,
  `groupId` int NOT NULL,
  `userId` varchar(50) NOT NULL,
  `preferredSegmentId` int DEFAULT NULL,
  `healthInfo` text,
  `occupation` varchar(100) DEFAULT NULL,
  `applicationReason` text,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `reviewedBy` varchar(50) DEFAULT NULL,
  `reviewedAt` datetime DEFAULT NULL,
  `rejectionReason` text,
  `cdatetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `udatetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`applicationId`),
  KEY `groupId` (`groupId`),
  KEY `userId` (`userId`),
  KEY `preferredSegmentId` (`preferredSegmentId`),
  CONSTRAINT `tbl_group_application_ibfk_1` FOREIGN KEY (`groupId`) REFERENCES `tbl_group` (`groupId`) ON DELETE CASCADE,
  CONSTRAINT `tbl_group_application_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users_tbl` (`userId`) ON DELETE CASCADE,
  CONSTRAINT `tbl_group_application_ibfk_3` FOREIGN KEY (`preferredSegmentId`) REFERENCES `tbl_route_segment` (`segmentId`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_group_application`
--

LOCK TABLES `tbl_group_application` WRITE;
/*!40000 ALTER TABLE `tbl_group_application` DISABLE KEYS */;
INSERT INTO `tbl_group_application` VALUES (1,1,'elle456',2,'123','123','123','approved','elle123','2025-12-01 13:26:35',NULL,'2025-12-01 13:25:28','2025-12-01 13:26:35'),(2,3,'elle456',6,'BPD','none','none','approved','elle123','2025-12-01 14:18:17',NULL,'2025-12-01 14:17:11','2025-12-01 14:18:17'),(3,3,'elle789',7,'none','none','none','approved','elle123','2025-12-01 14:18:13',NULL,'2025-12-01 14:17:46','2025-12-01 14:18:13'),(4,5,'Aaa',11,'ASD','학생','신간대로 운동을 하고 싶어요.','approved','me','2025-12-02 16:40:25',NULL,'2025-12-02 16:38:16','2025-12-02 16:40:25'),(5,5,'Bbb',12,'비만','식당 소유자','시간대로 운동하고 싶음.','approved','me','2025-12-02 16:58:16',NULL,'2025-12-02 16:57:47','2025-12-02 16:58:16'),(6,6,'Bbb',15,'121','21321','1321','approved','Aaa','2025-12-03 11:37:35',NULL,'2025-12-03 11:37:09','2025-12-03 11:37:35');
/*!40000 ALTER TABLE `tbl_group_application` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_group_member`
--

DROP TABLE IF EXISTS `tbl_group_member`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_group_member` (
  `memberId` int NOT NULL AUTO_INCREMENT,
  `groupId` int NOT NULL,
  `userId` varchar(50) NOT NULL,
  `role` enum('leader','member') DEFAULT 'member',
  `assignedSegmentId` int DEFAULT NULL,
  `joinedAt` datetime DEFAULT NULL,
  `totalActivities` int DEFAULT '0',
  `completedActivities` int DEFAULT '0',
  `completionRate` decimal(5,2) DEFAULT '0.00',
  `cdatetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `udatetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`memberId`),
  KEY `groupId` (`groupId`),
  KEY `userId` (`userId`),
  KEY `assignedSegmentId` (`assignedSegmentId`),
  CONSTRAINT `tbl_group_member_ibfk_1` FOREIGN KEY (`groupId`) REFERENCES `tbl_group` (`groupId`) ON DELETE CASCADE,
  CONSTRAINT `tbl_group_member_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users_tbl` (`userId`) ON DELETE CASCADE,
  CONSTRAINT `tbl_group_member_ibfk_3` FOREIGN KEY (`assignedSegmentId`) REFERENCES `tbl_route_segment` (`segmentId`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_group_member`
--

LOCK TABLES `tbl_group_member` WRITE;
/*!40000 ALTER TABLE `tbl_group_member` DISABLE KEYS */;
INSERT INTO `tbl_group_member` VALUES (1,1,'elle123','leader',1,'2025-12-01 13:24:47',1,1,100.00,'2025-12-01 13:24:47','2025-12-01 13:27:24'),(2,1,'elle456','member',2,'2025-12-01 13:26:35',1,1,100.00,'2025-12-01 13:26:35','2025-12-01 13:27:24'),(3,2,'elle123','leader',4,'2025-12-01 13:41:42',0,0,0.00,'2025-12-01 13:41:42','2025-12-01 13:41:42'),(4,3,'elle123','leader',5,'2025-12-01 14:16:05',13,13,100.00,'2025-12-01 14:16:05','2025-12-02 13:20:53'),(5,3,'elle789','member',7,'2025-12-01 14:18:13',13,6,42.86,'2025-12-01 14:18:13','2025-12-02 13:20:53'),(6,3,'elle456','member',6,'2025-12-01 14:18:17',13,7,50.00,'2025-12-01 14:18:17','2025-12-02 13:20:53'),(7,4,'me','leader',9,'2025-12-02 16:00:35',0,0,0.00,'2025-12-02 16:00:35','2025-12-02 16:00:35'),(8,5,'me','leader',10,'2025-12-02 16:11:43',1,1,100.00,'2025-12-02 16:11:43','2025-12-02 17:02:23'),(9,5,'Aaa','member',11,'2025-12-02 16:40:25',1,1,100.00,'2025-12-02 16:40:25','2025-12-02 17:02:23'),(10,5,'Bbb','member',12,'2025-12-02 16:58:16',1,0,0.00,'2025-12-02 16:58:16','2025-12-02 17:02:23'),(11,6,'Aaa','leader',14,'2025-12-03 11:36:33',1,1,100.00,'2025-12-03 11:36:33','2025-12-03 11:38:26'),(12,6,'Bbb','member',15,'2025-12-03 11:37:35',1,1,100.00,'2025-12-03 11:37:35','2025-12-03 11:38:26');
/*!40000 ALTER TABLE `tbl_group_member` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_notification`
--

DROP TABLE IF EXISTS `tbl_notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_notification` (
  `notificationId` int NOT NULL AUTO_INCREMENT,
  `userId` varchar(50) NOT NULL,
  `notificationType` varchar(50) DEFAULT NULL,
  `relatedType` varchar(50) DEFAULT NULL,
  `relatedId` int DEFAULT NULL,
  `fromUserId` varchar(50) DEFAULT NULL,
  `fromUserNickname` varchar(50) DEFAULT NULL,
  `content` text,
  `isRead` tinyint(1) DEFAULT '0',
  `readAt` datetime DEFAULT NULL,
  `cdatetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `udatetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`notificationId`),
  KEY `userId` (`userId`),
  CONSTRAINT `tbl_notification_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users_tbl` (`userId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_notification`
--

LOCK TABLES `tbl_notification` WRITE;
/*!40000 ALTER TABLE `tbl_notification` DISABLE KEYS */;
INSERT INTO `tbl_notification` VALUES (1,'elle123','app_submitted','group',1,'elle456','李美玲','孩子都要哭了 팀에 새로운 신청이 있습니다',1,'2025-12-02 09:47:58','2025-12-01 13:25:29','2025-12-02 09:47:58'),(2,'elle456','app_approved','group',1,NULL,NULL,'孩子都要哭了 팀 가입이 승인되었습니다',1,'2025-12-01 16:10:39','2025-12-01 13:26:35','2025-12-01 16:10:39'),(3,'elle123','app_submitted','group',3,'elle456','李美玲','孩子要疯了 팀에 새로운 신청이 있습니다',1,'2025-12-02 09:47:57','2025-12-01 14:17:11','2025-12-02 09:47:57'),(4,'elle123','app_submitted','group',3,'elle789','limeiling','孩子要疯了 팀에 새로운 신청이 있습니다',1,'2025-12-02 09:47:55','2025-12-01 14:17:46','2025-12-02 09:47:55'),(5,'elle789','app_approved','group',3,NULL,NULL,'孩子要疯了 팀 가입이 승인되었습니다',1,'2025-12-02 10:42:40','2025-12-01 14:18:13','2025-12-02 10:42:40'),(6,'elle456','app_approved','group',3,NULL,NULL,'孩子要疯了 팀 가입이 승인되었습니다',1,'2025-12-01 16:10:37','2025-12-01 14:18:17','2025-12-01 16:10:37'),(7,'elle123','new_follower','user',NULL,'elle456','李美玲',NULL,1,'2025-12-02 09:47:50','2025-12-01 14:31:03','2025-12-02 09:47:50'),(8,'elle456','new_follower','user',NULL,'elle123','ai作弊狗',NULL,1,'2025-12-01 16:10:34','2025-12-01 14:31:47','2025-12-01 16:10:34'),(9,'elle123','feed_comment','feed',1,'elle456','李美玲',NULL,1,'2025-12-02 09:47:48','2025-12-01 14:39:36','2025-12-02 09:47:48'),(10,'elle456','feed_comment','feed',2,'elle123','ai作弊狗',NULL,1,'2025-12-02 12:23:51','2025-12-01 17:39:42','2025-12-02 12:23:51'),(11,'elle456','feed_comment','feed',2,'elle123','ai作弊狗',NULL,1,'2025-12-02 12:23:48','2025-12-01 17:40:06','2025-12-02 12:23:48'),(12,'elle123','feed_like','feed',4,'elle456','李美玲',NULL,1,'2025-12-02 11:55:07','2025-12-01 17:56:03','2025-12-02 11:55:07'),(13,'elle123','feed_like','feed',3,'elle456','李美玲',NULL,1,'2025-12-01 17:59:08','2025-12-01 17:56:05','2025-12-01 17:59:08'),(14,'elle456','new_follower','user',NULL,'elle123','ai作弊狗',NULL,1,'2025-12-02 12:23:44','2025-12-02 11:54:44','2025-12-02 12:23:44'),(15,'me','app_submitted','group',5,'Aaa','Aaa','서초런닝팀 팀에 새로운 신청이 있습니다',1,'2025-12-02 16:38:45','2025-12-02 16:38:16','2025-12-02 16:38:45'),(16,'Aaa','app_approved','group',5,NULL,NULL,'서초런닝팀 팀 가입이 승인되었습니다',1,'2025-12-02 17:39:07','2025-12-02 16:40:25','2025-12-02 17:39:07'),(17,'me','app_submitted','group',5,'Bbb','Bbb','서초런닝팀 팀에 새로운 신청이 있습니다',1,'2025-12-02 16:58:04','2025-12-02 16:57:47','2025-12-02 16:58:04'),(18,'Bbb','app_approved','group',5,NULL,NULL,'서초런닝팀 팀 가입이 승인되었습니다',1,'2025-12-02 18:12:44','2025-12-02 16:58:16','2025-12-02 18:12:44'),(19,'Bbb','new_follower','user',NULL,'me','나',NULL,1,'2025-12-02 18:12:44','2025-12-02 17:52:07','2025-12-02 18:12:44'),(20,'me','feed_comment','feed',6,'Aaa','Aaa',NULL,1,'2025-12-02 18:08:53','2025-12-02 18:07:15','2025-12-02 18:08:53'),(21,'me','new_follower','user',NULL,'Bbb','Bbb',NULL,1,'2025-12-03 09:24:01','2025-12-02 18:12:50','2025-12-03 09:24:01'),(22,'Aaa','new_follower','user',NULL,'me','나',NULL,1,'2025-12-03 11:35:15','2025-12-03 09:38:36','2025-12-03 11:35:15'),(23,'me','new_follower','user',NULL,'Aaa','Aaa',NULL,1,'2025-12-03 11:42:13','2025-12-03 11:35:19','2025-12-03 11:42:13'),(24,'Aaa','app_submitted','group',6,'Bbb','Bbb','1231 팀에 새로운 신청이 있습니다',1,'2025-12-03 11:37:25','2025-12-03 11:37:09','2025-12-03 11:37:25'),(25,'Bbb','app_approved','group',6,NULL,NULL,'1231 팀 가입이 승인되었습니다',1,'2025-12-03 11:38:14','2025-12-03 11:37:35','2025-12-03 11:38:14'),(26,'me','feed_like','feed',6,'Bbb','Bbb',NULL,1,'2025-12-03 11:42:10','2025-12-03 11:41:20','2025-12-03 11:42:10');
/*!40000 ALTER TABLE `tbl_notification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_route`
--

DROP TABLE IF EXISTS `tbl_route`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_route` (
  `routeId` int NOT NULL AUTO_INCREMENT,
  `routeName` varchar(100) NOT NULL,
  `district` varchar(50) DEFAULT NULL,
  `startLocation` varchar(200) DEFAULT NULL,
  `endLocation` varchar(200) DEFAULT NULL,
  `totalDistance` decimal(10,2) DEFAULT NULL,
  `estimatedTime` int DEFAULT NULL,
  `segmentCount` int DEFAULT '0',
  `intensityLevel` enum('beginner','intermediate','advanced') DEFAULT 'intermediate',
  `avgPace` decimal(5,2) DEFAULT NULL,
  `description` text,
  `createdBy` varchar(50) DEFAULT NULL,
  `cdatetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `udatetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`routeId`),
  KEY `createdBy` (`createdBy`),
  CONSTRAINT `tbl_route_ibfk_1` FOREIGN KEY (`createdBy`) REFERENCES `users_tbl` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_route`
--

LOCK TABLES `tbl_route` WRITE;
/*!40000 ALTER TABLE `tbl_route` DISABLE KEYS */;
INSERT INTO `tbl_route` VALUES (1,'这回总行了吧','서초구','1','4',1.00,2,3,'intermediate',1.00,NULL,'elle123','2025-12-01 13:24:47','2025-12-01 13:24:47'),(2,'这回总行了吧','강남구','1','2',2.00,2,1,'intermediate',2.00,'2','elle123','2025-12-01 13:41:42','2025-12-01 13:41:42'),(3,'这回总行了吧？？？','서초구','1','5',4.00,4,4,'intermediate',1.00,NULL,'elle123','2025-12-01 14:16:05','2025-12-01 14:16:05'),(4,'123','서초구','1','1',1.00,1,1,'beginner',1.00,'1','me','2025-12-02 16:00:35','2025-12-02 16:00:35'),(5,'서초런닝','서초구','서울교육대학교','서일초등학교',4.00,20,4,'intermediate',5.00,'적당한 속도라 많은 참여 부탁해요~','me','2025-12-02 16:11:43','2025-12-02 16:11:43'),(6,'123','서초구','123','123',11.00,132,3,'intermediate',121.00,'12','Aaa','2025-12-03 11:36:33','2025-12-03 11:36:33');
/*!40000 ALTER TABLE `tbl_route` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_route_segment`
--

DROP TABLE IF EXISTS `tbl_route_segment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_route_segment` (
  `segmentId` int NOT NULL AUTO_INCREMENT,
  `routeId` int NOT NULL,
  `segmentOrder` int NOT NULL,
  `segmentName` varchar(100) DEFAULT NULL,
  `startPoint` varchar(200) DEFAULT NULL,
  `endPoint` varchar(200) DEFAULT NULL,
  `segmentDistance` decimal(10,2) DEFAULT NULL,
  `estimatedTime` int DEFAULT NULL,
  `maxTime` int DEFAULT NULL,
  `cdatetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `udatetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`segmentId`),
  KEY `routeId` (`routeId`),
  CONSTRAINT `tbl_route_segment_ibfk_1` FOREIGN KEY (`routeId`) REFERENCES `tbl_route` (`routeId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_route_segment`
--

LOCK TABLES `tbl_route_segment` WRITE;
/*!40000 ALTER TABLE `tbl_route_segment` DISABLE KEYS */;
INSERT INTO `tbl_route_segment` VALUES (1,1,1,'제1구간','1','2',1.00,1,1,'2025-12-01 13:24:47','2025-12-01 13:24:47'),(2,1,2,'제2구간','2','3',1.00,1,1,'2025-12-01 13:24:47','2025-12-01 13:24:47'),(3,1,3,'제3구간','3','4',1.00,1,1,'2025-12-01 13:24:47','2025-12-01 13:24:47'),(4,2,1,'제1구간','1','1',1.00,1,1,'2025-12-01 13:41:42','2025-12-01 13:41:42'),(5,3,1,'제1구간','1','2',1.00,1,1,'2025-12-01 14:16:05','2025-12-01 14:16:05'),(6,3,2,'제2구간','2','3',1.00,1,1,'2025-12-01 14:16:05','2025-12-01 14:16:05'),(7,3,3,'제3구간','3','4',1.00,1,2,'2025-12-01 14:16:05','2025-12-01 14:16:05'),(8,3,4,'제4구간','4','5',1.00,1,0,'2025-12-01 14:16:05','2025-12-01 14:16:05'),(9,4,1,'제1구간','1','1',1.00,1,1,'2025-12-02 16:00:35','2025-12-02 16:00:35'),(10,5,1,'제1구간','서울교육대학교','정효문화재단',1.00,5,5,'2025-12-02 16:11:43','2025-12-02 16:11:43'),(11,5,2,'제2구간','정효문화재단','기업은행',1.00,5,7,'2025-12-02 16:11:43','2025-12-02 16:11:43'),(12,5,3,'제3구간','기업은행','서울안강병원',1.00,5,7,'2025-12-02 16:11:43','2025-12-02 16:11:43'),(13,5,4,'제4구간','서울안강병원','서일초등학교',5.00,5,5,'2025-12-02 16:11:43','2025-12-02 16:11:43'),(14,6,1,'제1구간','1','1',1.00,1,3,'2025-12-03 11:36:33','2025-12-03 11:36:33'),(15,6,2,'제2구간','1','2',1.00,3,3,'2025-12-03 11:36:33','2025-12-03 11:36:33'),(16,6,3,'제3구간','1','1',1.00,1,3,'2025-12-03 11:36:33','2025-12-03 11:36:33');
/*!40000 ALTER TABLE `tbl_route_segment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_user`
--

DROP TABLE IF EXISTS `tbl_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_user` (
  `userId` varchar(50) NOT NULL,
  `pwd` varchar(100) NOT NULL,
  `userName` varchar(50) NOT NULL,
  `addr` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `cdatetime` datetime DEFAULT CURRENT_TIMESTAMP,
  `udatetime` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `follower` int DEFAULT '0',
  `following` int DEFAULT '0',
  `intro` varchar(300) DEFAULT '안녕하세요?',
  PRIMARY KEY (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_user`
--

LOCK TABLES `tbl_user` WRITE;
/*!40000 ALTER TABLE `tbl_user` DISABLE KEYS */;
INSERT INTO `tbl_user` VALUES ('','$2b$10$g8xShSRo7h57/fADrry3U.XwE4HOumEPrVmOmh1F1slW09cRM97/i','',NULL,NULL,'2025-11-26 10:00:15','2025-11-26 10:00:15',0,0,'안녕하세요?'),('elle123','$2b$10$7TDQdeqhB3IZP5r7L58zOONO0Vl3.tdjpUIwwNwSGGajpXvbcuMti','elle',NULL,NULL,'2025-11-18 11:06:52','2025-11-18 11:06:52',0,0,'안녕하세요?'),('qw123','$2b$10$flY/tTrvk3Y1t/OGnxXpfe5vD37uGBwhshIzCs.h9l8nuMheuI.g.','elle',NULL,NULL,'2025-11-24 09:35:50','2025-11-24 12:02:17',0,0,'안녕하세요?'),('user001','pwd1','홍길동','서울','010-1111-2222','2025-11-14 11:13:50','2025-11-14 11:13:50',0,0,'안녕하세요?'),('user002','pwd2','김철수','인천','010-2233-4455','2025-11-14 11:13:50','2025-11-14 11:13:50',0,0,'안녕하세요?'),('user003','pwd3','이영희','대전','010-3344-5566','2025-11-14 11:13:50','2025-11-14 11:13:50',0,0,'안녕하세요?'),('user004','pwd4','박지민','광주','010-4455-6677','2025-11-14 11:13:50','2025-11-14 11:13:50',0,0,'안녕하세요?'),('user005','pwd5','최민수','서울','010-5566-7788','2025-11-14 11:13:50','2025-11-14 11:13:50',0,0,'안녕하세요?'),('user006','pwd6','정수진','부산','010-6677-8899','2025-11-14 11:13:50','2025-11-14 11:13:50',0,0,'안녕하세요?'),('user007','pwd7','김하늘','인천','010-7788-9900','2025-11-14 11:13:50','2025-11-14 11:13:50',0,0,'안녕하세요?'),('user008','pwd8','이상훈','울산','010-8899-1000','2025-11-14 11:13:50','2025-11-14 11:13:50',0,0,'안녕하세요?'),('user009','pwd9','박세영','대구','010-9900-1111','2025-11-14 11:13:50','2025-11-14 11:13:50',0,0,'안녕하세요?'),('user010','pwd10','정예린','경기','010-1001-1222','2025-11-14 11:13:50','2025-11-14 11:13:50',0,0,'안녕하세요?');
/*!40000 ALTER TABLE `tbl_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'mysqldb'
--

--
-- Dumping routines for database 'mysqldb'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-03 12:10:27
