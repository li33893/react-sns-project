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
-- Table structure for table `tbl_route`
--

DROP TABLE IF EXISTS `tbl_route`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_route` (
  `routeId` int NOT NULL AUTO_INCREMENT COMMENT '路线ID',
  `routeName` varchar(200) NOT NULL COMMENT '路线名称',
  `district` varchar(100) NOT NULL COMMENT '所在区域(구)',
  `startLocation` varchar(200) NOT NULL COMMENT '起点地址',
  `endLocation` varchar(200) NOT NULL COMMENT '终点地址',
  `startLocationGPS` varchar(100) DEFAULT NULL COMMENT '起点GPS坐标(预留,格式:纬度,经度)',
  `endLocationGPS` varchar(100) DEFAULT NULL COMMENT '终点GPS坐标(预留)',
  `totalDistance` decimal(10,2) NOT NULL COMMENT '总距离(公里)-当前为各分段距离之和',
  `totalDistanceAuto` decimal(10,2) DEFAULT NULL COMMENT '总距离(公里)-API计算(预留)',
  `estimatedTime` int NOT NULL COMMENT '预计总时长(分钟)',
  `segmentCount` int NOT NULL DEFAULT '1' COMMENT '分段数量',
  `intensityLevel` enum('beginner','intermediate','advanced') NOT NULL COMMENT '强度等级',
  `avgPace` varchar(20) DEFAULT NULL COMMENT '平均配速(如:6分30秒/公里)',
  `description` text COMMENT '路线描述',
  `createdBy` varchar(50) NOT NULL COMMENT '创建者userId',
  `cdatetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `udatetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`routeId`),
  KEY `createdBy` (`createdBy`),
  CONSTRAINT `tbl_route_ibfk_1` FOREIGN KEY (`createdBy`) REFERENCES `users_tbl` (`userId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='跑步路线表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_route`
--

LOCK TABLES `tbl_route` WRITE;
/*!40000 ALTER TABLE `tbl_route` DISABLE KEYS */;
INSERT INTO `tbl_route` VALUES (2,'江南夜跑路线','강남구','논현역 3号出口','강남역 2号出口',NULL,NULL,4.50,NULL,30,3,'intermediate','6分40秒/公里',NULL,'elle123','2025-11-28 10:56:43','2025-11-28 10:56:43'),(3,'江南夜跑路线','강남구','논현역 3号出口','강남역 2号出口',NULL,NULL,4.50,NULL,30,3,'intermediate','6分40秒/公里',NULL,'elle123','2025-11-28 10:56:59','2025-11-28 10:56:59'),(4,'테스트 경로','서초구','논현역','강남역',NULL,NULL,10.00,NULL,35,2,'intermediate','6분30초','테스트 설명','elle123','2025-11-28 11:43:14','2025-11-28 11:43:14'),(5,'test2','서초구','1','5',NULL,NULL,10.00,NULL,4,3,'intermediate','1분/km',NULL,'elle123','2025-11-28 15:47:32','2025-11-28 15:47:32');
/*!40000 ALTER TABLE `tbl_route` ENABLE KEYS */;
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
