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
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_follow`
--

LOCK TABLES `tbl_follow` WRITE;
/*!40000 ALTER TABLE `tbl_follow` DISABLE KEYS */;
INSERT INTO `tbl_follow` VALUES (2,'elle456','elle123','2025-11-27 16:41:44'),(3,'elle123','elle456','2025-11-27 17:00:49'),(4,'elle789','elle456','2025-11-27 17:10:26'),(5,'elle789','elle123','2025-11-27 17:10:45'),(6,'elle123456','elle123','2025-11-27 17:31:53'),(7,'elle123','elle123456','2025-11-27 17:35:20'),(8,'elle456','elle123456','2025-11-27 17:39:36'),(9,'elle123456','elle456','2025-11-27 17:45:35');
/*!40000 ALTER TABLE `tbl_follow` ENABLE KEYS */;
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
