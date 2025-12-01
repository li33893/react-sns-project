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
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_comment`
--

LOCK TABLES `tbl_comment` WRITE;
/*!40000 ALTER TABLE `tbl_comment` DISABLE KEYS */;
INSERT INTO `tbl_comment` VALUES (8,10,'elle123','(๑•̀ㅂ•́)و✧','2025-11-27 15:14:08',NULL,NULL),(9,11,'elle123','毁灭吧','2025-11-27 15:18:19',NULL,NULL),(10,11,'elle123','@elle 加油','2025-11-27 16:40:00','elle123','elle'),(11,11,'elle456','就是就是','2025-11-27 16:41:07',NULL,NULL),(12,11,'elle123','@李美玲 对吧对吧','2025-11-27 16:45:43','elle456','李美玲'),(13,11,'elle123','@李美玲 是的是的','2025-11-27 16:52:16','elle456','李美玲'),(14,11,'elle123','@李美玲 嗯呢嗯呢','2025-11-27 16:56:17','elle456','李美玲'),(15,11,'elle456','@李美玲 加油加油','2025-11-27 16:59:29','elle456','李美玲'),(16,11,'elle456','@elle 加油加油','2025-11-27 16:59:42','elle123','elle'),(17,11,'elle789','来支持了','2025-11-27 17:10:07',NULL,NULL),(18,11,'elle123456','英雄所见略同了家人们','2025-11-27 17:30:37',NULL,NULL),(19,11,'elle123456','@黑松哥哥 支持世界毁灭','2025-11-27 17:31:06','elle789','黑松哥哥'),(20,13,'elle456','告诉我,我帮你记一下还不行吗宝','2025-11-28 09:11:24',NULL,NULL);
/*!40000 ALTER TABLE `tbl_comment` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-30 20:52:51
