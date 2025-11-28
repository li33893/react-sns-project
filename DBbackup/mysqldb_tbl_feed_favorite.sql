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
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_feed_favorite`
--

LOCK TABLES `tbl_feed_favorite` WRITE;
/*!40000 ALTER TABLE `tbl_feed_favorite` DISABLE KEYS */;
INSERT INTO `tbl_feed_favorite` VALUES (7,10,'elle123','2025-11-27 15:14:15'),(8,11,'elle123','2025-11-27 17:01:18'),(9,11,'elle789','2025-11-27 17:12:18'),(10,11,'elle456','2025-11-27 18:03:17');
/*!40000 ALTER TABLE `tbl_feed_favorite` ENABLE KEYS */;
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
