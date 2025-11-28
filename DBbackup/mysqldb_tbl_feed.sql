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
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_feed`
--

LOCK TABLES `tbl_feed` WRITE;
/*!40000 ALTER TABLE `tbl_feed` DISABLE KEYS */;
INSERT INTO `tbl_feed` VALUES (10,'elle123','daily','又活了一天',NULL,NULL,NULL,NULL,'真好，又活了一天，已经很强了',2,1,1,0,'2025-11-27 15:13:36','2025-11-27 18:04:36'),(11,'elle123','vent','想死，但又觉得该死的另有其人',NULL,NULL,NULL,NULL,'如题',3,3,11,1,'2025-11-27 15:17:50','2025-11-27 18:03:17'),(12,'elle123','group','太菜了',NULL,NULL,NULL,NULL,'菜完了',1,0,0,0,'2025-11-27 18:19:54','2025-11-27 18:19:58'),(13,'elle123','vent','其实拿自己的生日当密码挺安全的',NULL,NULL,NULL,NULL,'反正又没人记得你的生日',0,0,1,0,'2025-11-28 09:10:27','2025-11-28 09:11:24');
/*!40000 ALTER TABLE `tbl_feed` ENABLE KEYS */;
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
