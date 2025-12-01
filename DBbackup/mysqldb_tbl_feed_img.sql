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
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_feed_img`
--

LOCK TABLES `tbl_feed_img` WRITE;
/*!40000 ALTER TABLE `tbl_feed_img` DISABLE KEYS */;
INSERT INTO `tbl_feed_img` VALUES (13,10,'1764224016342-è¯¥æ­»çå¦æå¶äºº.webp','http://localhost:3010/uploads/1764224016342-è¯¥æ­»çå¦æå¶äºº.webp',1,'2025-11-27 15:13:36','2025-11-27 15:13:36'),(14,11,'1764224270565-åæ´»äºä¸å¤©.webp','http://localhost:3010/uploads/1764224270565-åæ´»äºä¸å¤©.webp',1,'2025-11-27 15:17:50','2025-11-27 15:17:50'),(15,11,'1764224270565-è¯¥æ­»çå¦æå¶äºº.webp','http://localhost:3010/uploads/1764224270565-è¯¥æ­»çå¦æå¶äºº.webp',0,'2025-11-27 15:17:50','2025-11-27 15:17:50'),(16,12,'1764235194444-è.webp','http://localhost:3010/uploads/1764235194444-è.webp',1,'2025-11-27 18:19:54','2025-11-27 18:19:54'),(17,12,'1764235194445-ç.webp','http://localhost:3010/uploads/1764235194445-ç.webp',0,'2025-11-27 18:19:54','2025-11-27 18:19:54'),(18,13,'1764288627060-åæ­£åæ²¡äººè®°å¾ä½ ççæ¥.webp','http://localhost:3010/uploads/1764288627060-åæ­£åæ²¡äººè®°å¾ä½ ççæ¥.webp',1,'2025-11-28 09:10:27','2025-11-28 09:10:27');
/*!40000 ALTER TABLE `tbl_feed_img` ENABLE KEYS */;
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
