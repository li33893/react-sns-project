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
-- Table structure for table `tbl_group`
--

DROP TABLE IF EXISTS `tbl_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_group` (
  `groupId` int NOT NULL AUTO_INCREMENT COMMENT '队伍ID',
  `groupName` varchar(200) NOT NULL COMMENT '队伍名称',
  `routeId` int NOT NULL COMMENT '使用的路线ID',
  `leaderId` varchar(50) NOT NULL COMMENT '队长userId',
  `district` varchar(100) NOT NULL COMMENT '所在区域(구)',
  `scheduleType` enum('weekly','once') NOT NULL DEFAULT 'weekly' COMMENT '活动类型',
  `weekDays` json DEFAULT NULL COMMENT '每周哪几天(JSON数组,如["1","3","5"])',
  `startTime` time NOT NULL COMMENT '开始时间(如19:00)',
  `maxMembers` int NOT NULL COMMENT '最大人数(等于分段数)',
  `currentMembers` int NOT NULL DEFAULT '1' COMMENT '当前人数(包括队长)',
  `status` enum('recruiting','full','active','ended') NOT NULL DEFAULT 'recruiting' COMMENT '队伍状态',
  `description` text COMMENT '队伍描述',
  `cdatetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `udatetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`groupId`),
  KEY `routeId` (`routeId`),
  KEY `leaderId` (`leaderId`),
  CONSTRAINT `tbl_group_ibfk_1` FOREIGN KEY (`routeId`) REFERENCES `tbl_route` (`routeId`) ON DELETE CASCADE,
  CONSTRAINT `tbl_group_ibfk_2` FOREIGN KEY (`leaderId`) REFERENCES `users_tbl` (`userId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='跑步队伍表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_group`
--

LOCK TABLES `tbl_group` WRITE;
/*!40000 ALTER TABLE `tbl_group` DISABLE KEYS */;
INSERT INTO `tbl_group` VALUES (2,'江南夜跑小队',3,'elle123','강남구','weekly','[\"1\", \"3\", \"5\"]','19:00:00',3,1,'recruiting',NULL,'2025-11-28 10:56:59','2025-11-28 10:56:59'),(3,'테스트',4,'elle123','서초구','weekly','[\"1\", \"3\", \"5\"]','15:50:00',2,1,'recruiting','테스트','2025-11-28 11:43:14','2025-11-28 11:43:14'),(4,'test2',5,'elle123','서초구','weekly','[\"0\", \"1\", \"2\", \"3\", \"4\", \"5\", \"6\"]','15:50:00',3,1,'recruiting',NULL,'2025-11-28 15:47:32','2025-11-28 15:47:32');
/*!40000 ALTER TABLE `tbl_group` ENABLE KEYS */;
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
