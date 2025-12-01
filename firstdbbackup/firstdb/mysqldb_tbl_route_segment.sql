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
-- Table structure for table `tbl_route_segment`
--

DROP TABLE IF EXISTS `tbl_route_segment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_route_segment` (
  `segmentId` int NOT NULL AUTO_INCREMENT COMMENT '分段ID',
  `routeId` int NOT NULL COMMENT '所属路线ID',
  `segmentOrder` int NOT NULL COMMENT '分段顺序(1,2,3...)',
  `segmentName` varchar(100) DEFAULT NULL COMMENT '分段名称(如:第1段)',
  `startPoint` varchar(200) NOT NULL COMMENT '起点地址',
  `endPoint` varchar(200) NOT NULL COMMENT '终点地址',
  `startPointGPS` varchar(100) DEFAULT NULL COMMENT '起点GPS(预留)',
  `endPointGPS` varchar(100) DEFAULT NULL COMMENT '终点GPS(预留)',
  `segmentDistance` decimal(10,2) NOT NULL COMMENT '分段距离(公里)-当前使用手动输入',
  `segmentDistanceAuto` decimal(10,2) DEFAULT NULL COMMENT '分段距离(公里)-API自动计算(预留)',
  `estimatedTime` int NOT NULL COMMENT '预计时长(分钟)',
  `maxTime` int NOT NULL COMMENT '最大允许时长(分钟)-超过算超时',
  `cdatetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `udatetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`segmentId`),
  UNIQUE KEY `unique_route_segment` (`routeId`,`segmentOrder`),
  CONSTRAINT `tbl_route_segment_ibfk_1` FOREIGN KEY (`routeId`) REFERENCES `tbl_route` (`routeId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='路线分段表-每段的详细信息';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_route_segment`
--

LOCK TABLES `tbl_route_segment` WRITE;
/*!40000 ALTER TABLE `tbl_route_segment` DISABLE KEYS */;
INSERT INTO `tbl_route_segment` VALUES (1,2,1,'第1段','논현역 3号出口','신논현역',NULL,NULL,1.50,NULL,10,12,'2025-11-28 10:56:43','2025-11-28 10:56:43'),(2,2,2,'第2段','신논현역','강남역 10号出口',NULL,NULL,1.50,NULL,10,12,'2025-11-28 10:56:43','2025-11-28 10:56:43'),(3,2,3,'第3段','강남역 10号出口','강남역 2号出口',NULL,NULL,1.50,NULL,10,12,'2025-11-28 10:56:43','2025-11-28 10:56:43'),(4,3,1,'第1段','논현역 3号出口','신논현역',NULL,NULL,1.50,NULL,10,12,'2025-11-28 10:56:59','2025-11-28 10:56:59'),(5,3,2,'第2段','신논현역','강남역 10号出口',NULL,NULL,1.50,NULL,10,12,'2025-11-28 10:56:59','2025-11-28 10:56:59'),(6,3,3,'第3段','강남역 10号出口','강남역 2号出口',NULL,NULL,1.50,NULL,10,12,'2025-11-28 10:56:59','2025-11-28 10:56:59'),(7,4,1,'제1구간','논현역','신논현역',NULL,NULL,1.50,NULL,10,12,'2025-11-28 11:43:14','2025-11-28 11:43:14'),(8,4,2,'제2구간','신논현역','강남역',NULL,NULL,1.50,NULL,10,12,'2025-11-28 11:43:14','2025-11-28 11:43:14'),(9,5,1,'제1구간','1','2',NULL,NULL,1.50,NULL,1,1,'2025-11-28 15:47:32','2025-11-28 15:47:32'),(10,5,2,'제2구간','2','3',NULL,NULL,1.50,NULL,1,1,'2025-11-28 15:47:32','2025-11-28 15:47:32'),(11,5,3,'제3구간','3','4',NULL,NULL,1.50,NULL,1,1,'2025-11-28 15:47:32','2025-11-28 15:47:32');
/*!40000 ALTER TABLE `tbl_route_segment` ENABLE KEYS */;
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
