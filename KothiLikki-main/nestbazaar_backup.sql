-- MySQL dump 10.13  Distrib 8.0.39, for Win64 (x86_64)
--
-- Host: localhost    Database: nestbazaar
-- ------------------------------------------------------
-- Server version	8.0.39

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `buy_requests`
--

DROP TABLE IF EXISTS `buy_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `buy_requests` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `listingId` int NOT NULL,
  `status` enum('pending','approved','rejected','completed') DEFAULT 'pending',
  `buyerMessage` text COMMENT 'Message from buyer to admin',
  `adminNotes` text COMMENT 'Admin notes for the request',
  `agreementDocuments` json DEFAULT NULL COMMENT 'Array of agreement document URLs uploaded by admin',
  `approvedAt` datetime DEFAULT NULL,
  `completedAt` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  KEY `listingId` (`listingId`),
  CONSTRAINT `buy_requests_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `buy_requests_ibfk_2` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `buy_requests`
--

LOCK TABLES `buy_requests` WRITE;
/*!40000 ALTER TABLE `buy_requests` DISABLE KEYS */;
INSERT INTO `buy_requests` VALUES (3,42,20,'approved','we are ready to buy the hosue',NULL,'[]','2026-05-20 14:42:24',NULL,'2026-05-20 14:00:20','2026-05-20 14:42:24'),(4,43,55,'approved','need house',NULL,'[]','2026-05-20 14:46:43',NULL,'2026-05-20 14:46:01','2026-05-20 14:46:43');
/*!40000 ALTER TABLE `buy_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kyc_documents`
--

DROP TABLE IF EXISTS `kyc_documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kyc_documents` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `aadhaarUrl` varchar(255) DEFAULT NULL,
  `panUrl` varchar(255) DEFAULT NULL,
  `jobIdUrl` varchar(255) DEFAULT NULL,
  `otherDocUrl` varchar(255) DEFAULT NULL,
  `otherDocName` varchar(255) DEFAULT NULL,
  `status` enum('pending','verified','rejected') DEFAULT 'pending',
  `adminNotes` text,
  `verifiedAt` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `occupation` enum('salaried','business','student','self_employed','other') DEFAULT NULL,
  `aadhaarNumber` varchar(12) DEFAULT NULL,
  `salarySlipUrl` varchar(255) DEFAULT NULL,
  `businessRegUrl` varchar(255) DEFAULT NULL,
  `gstCertUrl` varchar(255) DEFAULT NULL,
  `collegeIdUrl` varchar(255) DEFAULT NULL,
  `bonafideUrl` varchar(255) DEFAULT NULL,
  `workProofUrl` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `userId` (`userId`),
  CONSTRAINT `kyc_documents_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kyc_documents`
--

LOCK TABLES `kyc_documents` WRITE;
/*!40000 ALTER TABLE `kyc_documents` DISABLE KEYS */;
INSERT INTO `kyc_documents` VALUES (2,3,'/api/kyc/file/1777898517416_fc1ewh7zj.pdf',NULL,NULL,NULL,NULL,'verified',NULL,'2026-05-04 12:42:13','2026-05-04 12:41:57','2026-05-04 12:42:13',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(4,42,'https://res.cloudinary.com/dkupckm3c/raw/upload/v1779285700/INFRAALL/vdi2kcup6uywmlqv2efk',NULL,NULL,NULL,NULL,'verified',NULL,'2026-05-20 14:41:50','2026-05-20 14:01:43','2026-05-20 14:41:50','student','234512345678',NULL,NULL,NULL,'https://res.cloudinary.com/dkupckm3c/image/upload/v1779285701/INFRAALL/anpxkiz5ic9wx6xydzlz.png',NULL,NULL),(5,43,'https://res.cloudinary.com/dkupckm3c/raw/upload/v1779286912/INFRAALL/eargnjgoht71btnvrlhg',NULL,NULL,NULL,NULL,'verified',NULL,'2026-05-20 14:41:54','2026-05-20 14:20:30','2026-05-20 14:41:54','student','833584281234',NULL,NULL,NULL,'https://res.cloudinary.com/dkupckm3c/image/upload/v1779286990/INFRAALL/ttu6si0r0rkovsoaadkv.png',NULL,NULL);
/*!40000 ALTER TABLE `kyc_documents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `leisureleases`
--

DROP TABLE IF EXISTS `leisureleases`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `leisureleases` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `listingId` int NOT NULL,
  `leaseYear` int NOT NULL COMMENT 'Year for which the leisure lease is taken (e.g., 2024, 2025)',
  `startDate` date NOT NULL COMMENT 'Start date of the leisure lease',
  `endDate` date NOT NULL COMMENT 'End date of the leisure lease (typically 1 year from start)',
  `totalAmount` decimal(15,2) NOT NULL COMMENT 'Total amount paid for the full year lease',
  `monthlyEquivalent` decimal(15,2) NOT NULL COMMENT 'Monthly rent equivalent (for reference)',
  `paymentStatus` enum('pending','paid','failed','refunded') DEFAULT 'pending',
  `paymentId` varchar(255) DEFAULT NULL COMMENT 'Razorpay payment ID',
  `orderId` varchar(255) DEFAULT NULL COMMENT 'Razorpay order ID',
  `status` enum('pending','active','completed','cancelled') DEFAULT 'pending',
  `notes` text COMMENT 'Additional notes or terms for the leisure lease',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `leaseDurationYears` int DEFAULT '1' COMMENT 'Number of years for the lease (e.g., 1, 2, 3, 4, 5)',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_property_year_lease` (`listingId`,`leaseYear`),
  KEY `userId` (`userId`),
  CONSTRAINT `leisureleases_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `leisureleases_ibfk_2` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `leisureleases`
--

LOCK TABLES `leisureleases` WRITE;
/*!40000 ALTER TABLE `leisureleases` DISABLE KEYS */;
INSERT INTO `leisureleases` VALUES (7,3,85,2026,'2026-05-20','2028-05-20',312.00,13.00,'pending',NULL,'order_Sre7YoGvUEYHXb','pending',NULL,'2026-05-20 14:09:03','2026-05-20 14:09:03',2),(11,3,86,2026,'2026-05-20','2027-05-20',156.00,13.00,'pending',NULL,'order_SreDOGBRRyr1Jr','pending',NULL,'2026-05-20 14:14:34','2026-05-20 14:14:34',1),(13,43,22,2026,'2026-05-20','2028-05-20',3600.00,150.00,'paid','pay_Srehocp9LLR4Wv','order_SrehgxPSyGEqQk','active',NULL,'2026-05-20 14:43:15','2026-05-20 14:43:38',2);
/*!40000 ALTER TABLE `leisureleases` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `listings`
--

DROP TABLE IF EXISTS `listings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `listings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text,
  `category` enum('property_sell','property_rent','furniture','services','materials','electronics','vehicles') NOT NULL,
  `subCategory` varchar(255) DEFAULT NULL,
  `price` decimal(15,2) DEFAULT NULL,
  `priceType` enum('fixed','negotiable','per_month','per_sqft','per_unit','per_kg','hourly','project_based') DEFAULT 'fixed',
  `location` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `pincode` varchar(255) DEFAULT NULL,
  `images` json DEFAULT NULL,
  `bedrooms` int DEFAULT NULL,
  `bathrooms` int DEFAULT NULL,
  `area` decimal(10,2) DEFAULT NULL,
  `areaUnit` enum('sqft','sqmt','acre','bigha') DEFAULT 'sqft',
  `amenities` json DEFAULT NULL,
  `isVerified` tinyint(1) DEFAULT '0',
  `isFeatured` tinyint(1) DEFAULT '0',
  `status` enum('active','sold','rented','inactive') DEFAULT 'active',
  `views` int DEFAULT '0',
  `userId` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `propertyAge` varchar(255) DEFAULT NULL,
  `facing` varchar(255) DEFAULT NULL,
  `floor` int DEFAULT NULL,
  `totalFloors` int DEFAULT NULL,
  `parking` varchar(255) DEFAULT NULL,
  `furnishing` varchar(255) DEFAULT NULL,
  `brand` varchar(255) DEFAULT NULL,
  `model` varchar(255) DEFAULT NULL,
  `condition` enum('new','like_new','good','fair','needs_repair') DEFAULT 'new',
  `warranty` varchar(255) DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `unit` varchar(255) DEFAULT NULL,
  `year` varchar(255) DEFAULT NULL,
  `serviceType` varchar(255) DEFAULT NULL,
  `experience` varchar(255) DEFAULT NULL,
  `availability` varchar(255) DEFAULT NULL,
  `serviceArea` varchar(255) DEFAULT NULL,
  `certifications` text,
  `languages` varchar(255) DEFAULT NULL,
  `minPrice` decimal(15,2) DEFAULT NULL,
  `maxPrice` decimal(15,2) DEFAULT NULL,
  `kmDriven` int DEFAULT NULL,
  `fuelType` varchar(255) DEFAULT NULL,
  `transmission` varchar(255) DEFAULT NULL,
  `owners` varchar(255) DEFAULT NULL,
  `availableTimeSlots` json DEFAULT NULL,
  `servicePackage` varchar(255) DEFAULT NULL,
  `contactPerson` varchar(255) DEFAULT NULL,
  `contactPhone` varchar(255) DEFAULT NULL,
  `contactEmail` varchar(255) DEFAULT NULL,
  `whatsappNumber` varchar(255) DEFAULT NULL,
  `businessName` varchar(255) DEFAULT NULL,
  `businessAddress` text,
  `agreementDocument` varchar(255) DEFAULT NULL,
  `commissionPercentage` decimal(5,2) DEFAULT '10.00',
  `ownerAadhaar` varchar(12) DEFAULT NULL,
  `ownerPan` varchar(10) DEFAULT NULL,
  `ownerDocuments` json DEFAULT NULL,
  `thalukaDocuments` json DEFAULT NULL,
  `ownerBankDetails` json DEFAULT NULL,
  `materialType` varchar(255) DEFAULT NULL,
  `isLeisure` tinyint(1) DEFAULT '0' COMMENT 'Whether this rental property can be leased for leisure purposes (full year commitment)',
  `ownerAccountId` int DEFAULT NULL,
  `vendorId` int DEFAULT NULL,
  `maxLeasePeriodYears` int DEFAULT NULL COMMENT 'Maximum number of years the owner allows for leisure lease (e.g., 1, 2, 3, 4, 5)',
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  KEY `fk_listings_owner_account` (`ownerAccountId`),
  KEY `fk_listing_vendor` (`vendorId`),
  CONSTRAINT `fk_listing_vendor` FOREIGN KEY (`vendorId`) REFERENCES `vendors` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_listings_owner_account` FOREIGN KEY (`ownerAccountId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `listings_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `listings_ibfk_10` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `listings_ibfk_11` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `listings_ibfk_12` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `listings_ibfk_13` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `listings_ibfk_14` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `listings_ibfk_15` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `listings_ibfk_16` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `listings_ibfk_17` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `listings_ibfk_18` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `listings_ibfk_19` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `listings_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `listings_ibfk_20` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `listings_ibfk_21` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `listings_ibfk_22` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `listings_ibfk_23` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `listings_ibfk_24` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `listings_ibfk_25` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `listings_ibfk_26` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `listings_ibfk_27` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `listings_ibfk_28` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `listings_ibfk_29` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `listings_ibfk_3` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `listings_ibfk_30` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `listings_ibfk_31` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `listings_ibfk_32` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `listings_ibfk_33` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `listings_ibfk_34` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `listings_ibfk_35` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `listings_ibfk_36` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `listings_ibfk_37` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `listings_ibfk_38` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `listings_ibfk_39` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `listings_ibfk_4` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `listings_ibfk_40` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `listings_ibfk_41` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `listings_ibfk_42` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `listings_ibfk_43` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `listings_ibfk_44` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `listings_ibfk_45` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `listings_ibfk_46` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `listings_ibfk_47` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `listings_ibfk_48` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `listings_ibfk_49` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `listings_ibfk_5` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `listings_ibfk_50` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `listings_ibfk_51` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `listings_ibfk_52` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `listings_ibfk_53` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `listings_ibfk_6` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `listings_ibfk_7` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `listings_ibfk_8` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `listings_ibfk_9` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=89 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `listings`
--

LOCK TABLES `listings` WRITE;
/*!40000 ALTER TABLE `listings` DISABLE KEYS */;
INSERT INTO `listings` VALUES (2,'Siva House','Large house with great Ventilation with green colored trees with fresh air ','property_rent','House',14000.00,'per_month','Naiduvaripalli','Rajampeta','AndhraPradesh','516128','[\"https://res.cloudinary.com/dkupckm3c/image/upload/v1776744462/nestbazaar/qvikzyierxobhpwsxedg.webp\"]',3,4,NULL,'sqft','[]',1,1,'rented',103,32,'2026-04-21 04:07:48','2026-05-04 13:11:58',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'new',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Demo Owner','9876543210','demoowner@gmail.com',NULL,NULL,NULL,NULL,10.00,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL),(7,'Ariel Sofa','Soft Sofa','furniture','Sofa',13999.00,'negotiable',NULL,'Banglore',NULL,NULL,'[\"https://res.cloudinary.com/dkupckm3c/image/upload/v1776786727/nestbazaar/oqo5nnjdjcqy6rppzmjx.jpg\"]',NULL,NULL,NULL,'sqft','[]',1,1,'active',18,32,'2026-04-21 15:52:07','2026-04-28 07:34:55',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'new',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Demo Owner','9876543210','demoowner@gmail.com',NULL,NULL,NULL,NULL,10.00,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL),(8,'Reliable chair','soft lenght cloth with sleepy cotton','furniture','Chair',2500.00,'fixed',NULL,'Banglore',NULL,NULL,'[\"https://res.cloudinary.com/dkupckm3c/image/upload/v1777045755/INFRAALL/ajt5xtaw2deagzehv3xn.webp\"]',NULL,NULL,NULL,'sqft','[]',1,1,'active',0,32,'2026-04-24 15:49:20','2026-04-27 15:13:35',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'new',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Demo Owner','9876543210','demoowner@gmail.com',NULL,NULL,NULL,NULL,10.00,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL),(9,'Abendment Hosue','Commerical appartment with alll facilites','property_sell','House',999999.00,'negotiable',NULL,'Kadapa',NULL,NULL,'[]',3,5,NULL,'sqft','[]',1,1,'active',4,32,'2026-04-24 16:37:16','2026-05-07 17:52:00',NULL,'South',NULL,NULL,'2car','furnished',NULL,NULL,'new',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Demo Owner','9876543210','demoowner@gmail.com',NULL,NULL,NULL,NULL,10.00,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL),(14,'Modern Test Apartment','Beautiful 2BHK apartment perfect for testing rental system. Fully furnished with modern amenities.','property_rent','apartment',100.00,'fixed','Test Colony, Sector 5','Test City','Test State','123456','[\"https://placehold.co/800x600/1e1b4b/818cf8?text=Test+Apartment\"]',2,2,1200.00,'sqft','[\"Parking\", \"Security\", \"Lift\", \"Power Backup\", \"Water Supply\"]',0,0,'active',0,32,'2026-05-04 13:08:52','2026-05-13 14:56:24',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'new',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Demo Owner','9876543210','demoowner@gmail.com',NULL,NULL,NULL,NULL,10.00,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL),(15,'Sekhar Test House','Exclusive 2BHK house for sekharravi testing. Independent house with all modern facilities.','property_rent','house',110.00,'fixed','Sekhar Colony, Block A','Hyderabad','Telangana','500001','[\"https://placehold.co/800x600/0f766e/ffffff?text=Sekhar+House\"]',2,2,1400.00,'sqft','[\"Parking\", \"Garden\", \"Security\", \"Power Backup\", \"Bore Well\"]',0,0,'active',19,32,'2026-05-04 13:15:29','2026-05-13 15:55:46',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'new',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Demo Owner','9876543210','demoowner@gmail.com',NULL,NULL,NULL,NULL,10.00,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL),(16,'Likhitha House','House','property_rent','House',120.00,'per_month','Adyar','Chennai','Tamil nadu',NULL,'[\"https://res.cloudinary.com/dkupckm3c/image/upload/v1777902197/INFRAALL/n4t6aswjnjvzge5j1gbi.jpg\"]',3,3,NULL,'sqft','[\"Parking\", \"Play Area\", \"Garden\", \"Swimming Pool\", \"Power Backup\", \"Internet/Wi-Fi\", \"Terrace\"]',1,1,'active',19,32,'2026-05-04 13:43:27','2026-05-13 15:20:24','4years','North-West',NULL,NULL,'2 Car 3 Bike','furnished',NULL,NULL,'new',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'\"[\\\"Morning (9 AM - 12 PM)\\\"]\"',NULL,'Demo Owner','9876543210','demoowner@gmail.com',NULL,NULL,NULL,NULL,10.00,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,4),(17,'lIKKI HOUSE','hOUSE','property_rent','House',13000.00,'per_month','GachiBowli','Hyderabad',NULL,NULL,'[]',33,NULL,NULL,'sqft','[\"Parking\", \"Lift\"]',1,0,'rented',2,32,'2026-05-04 14:07:41','2026-05-04 14:08:47',NULL,NULL,NULL,NULL,NULL,'furnished',NULL,NULL,'new',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'\"[\\\"Evening (3 PM - 6 PM)\\\"]\"',NULL,'Demo Owner','9876543210','demoowner@gmail.com',NULL,NULL,NULL,NULL,10.00,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL),(19,'3BHK Luxury Villa in Koramangala','Beautiful 3BHK villa with modern amenities, garden, and parking. Prime location near tech parks and malls.','property_sell','Villa',8500000.00,'negotiable','Koramangala 5th Block','Bangalore','Karnataka','560095','[\"https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800\", \"https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800\"]',3,3,2200.00,'sqft','[\"Garden\", \"Security\", \"Power Backup\", \"Water Supply\"]',1,1,'active',14,8,'2026-05-11 14:49:36','2026-05-19 15:02:36','2 years','East',0,2,'2 Car','Semi-Furnished',NULL,NULL,'new',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'[]',NULL,'Rajesh Kumar','9876543210','rajesh@example.com',NULL,'Kumar Properties','Koramangala, Bangalore',NULL,2.50,NULL,NULL,'[]','[]','{}',NULL,0,NULL,NULL,NULL),(20,'2BHK Apartment in Whitefield','Spacious 2BHK apartment with balcony, lift, and security. Close to IT companies and shopping centers.','property_sell','Apartment',4200000.00,'fixed','Whitefield Main Road','Bangalore','Karnataka','560066','[\"https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800\", \"https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800\"]',2,2,1100.00,'sqft','[\"Lift\", \"Security\", \"Gym\", \"Swimming Pool\"]',1,0,'active',4,8,'2026-05-11 14:49:36','2026-05-20 13:59:59','5 years','North',4,8,'1 Car','Unfurnished',NULL,NULL,'new',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'[]',NULL,'Priya Sharma','9876543211','priya@example.com',NULL,'Sharma Realty','Whitefield, Bangalore',NULL,3.00,NULL,NULL,'[]','[]','{}',NULL,0,NULL,NULL,NULL),(21,'1BHK Furnished Flat for Rent','Fully furnished 1BHK flat with all modern amenities. Perfect for working professionals.','property_rent','Apartment',140.00,'per_month','HSR Layout Sector 2','Bangalore','Karnataka','560102','[\"https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800\", \"https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800\"]',1,1,650.00,'sqft','[\"WiFi\", \"AC\", \"Washing Machine\", \"Refrigerator\"]',1,0,'rented',22,32,'2026-05-11 14:49:36','2026-05-13 15:54:41','3 years','South',2,5,'Bike','Fully Furnished',NULL,NULL,'new',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'[\"Morning\", \"Evening\"]',NULL,'Demo Owner','9876543210','demoowner@gmail.com','9876543212','Patel Rentals','HSR Layout, Bangalore',NULL,1.00,NULL,NULL,'[]','[]','{}',NULL,1,NULL,NULL,3),(22,'3BHK House for Family Rent','Spacious 3BHK independent house with garden and parking. Family-friendly neighborhood.','property_rent','House',150.00,'per_month','Jayanagar 4th Block','Bangalore','Karnataka','560011','[\"https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800\", \"https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800\"]',3,2,1800.00,'sqft','[\"Garden\", \"Terrace\", \"Security\", \"Power Backup\"]',1,0,'active',19,8,'2026-05-11 14:49:36','2026-05-20 14:43:06','8 years','East',0,1,'2 Car','Semi-Furnished',NULL,NULL,'new',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'[\"Morning\", \"Afternoon\", \"Evening\"]',NULL,'Sunita Reddy','9876543213','sunita@example.com','9876543213','Reddy Properties','Jayanagar, Bangalore',NULL,1.50,NULL,NULL,'[]','[]','{}',NULL,1,NULL,NULL,3),(23,'L-Shaped Sofa Set - Premium Quality','Beautiful L-shaped sofa set in excellent condition. Comfortable seating for 6 people. Fabric upholstery.','furniture','Sofa',35000.00,'negotiable','Indiranagar','Bangalore','Karnataka','560038','[\"https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800\", \"https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800\"]',NULL,NULL,NULL,'sqft','[]',1,0,'active',4,8,'2026-05-11 14:49:36','2026-05-11 15:14:42',NULL,NULL,NULL,NULL,NULL,NULL,'Urban Ladder','Barcelona L-Shaped Sofa','like_new','6 months',1,'Set','2023',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'[]',NULL,'Vikram Singh','9876543214','vikram@example.com','9876543214','Singh Furniture','Indiranagar, Bangalore',NULL,10.00,NULL,NULL,'[]','[]','{}',NULL,0,NULL,NULL,NULL),(24,'King Size Bed with Mattress','Solid wood king size bed with premium mattress. Excellent condition, barely used.','furniture','Bed',28000.00,'fixed','Malleshwaram','Bangalore','Karnataka','560003','[\"https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800\", \"https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800\"]',NULL,NULL,NULL,'sqft','[]',1,0,'active',2,8,'2026-05-11 14:49:36','2026-05-11 16:03:43',NULL,NULL,NULL,NULL,NULL,NULL,'Godrej Interio','Engineered Wood King Bed','good','1 year',1,'Set','2022',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'[]',NULL,'Meera Joshi','9876543215','meera@example.com','9876543215','Joshi Furniture Store','Malleshwaram, Bangalore',NULL,10.00,NULL,NULL,'[]','[]','{}',NULL,0,NULL,NULL,NULL),(25,'Professional Plumbing Services','Expert plumbing services for residential and commercial properties. 24/7 emergency service available.','services','Plumbing',NULL,'project_based','All Bangalore','Bangalore','Karnataka','560001','[\"https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800\", \"https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800\"]',NULL,NULL,NULL,'sqft','[]',1,0,'active',0,8,'2026-05-11 14:49:36','2026-05-11 14:49:36',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'new',NULL,NULL,NULL,NULL,'Plumbing','8 years','24/7','Bangalore','Licensed Plumber, Certified in Modern Plumbing Systems','English, Hindi, Kannada',500.00,5000.00,NULL,NULL,NULL,NULL,'[]','Monthly','Ravi Kumar','9876543216','ravi.plumber@example.com','9876543216','Kumar Plumbing Services','Rajajinagar, Bangalore',NULL,10.00,NULL,NULL,'[]','[]','{}',NULL,0,NULL,NULL,NULL),(26,'Home Cleaning & Maintenance','Professional home cleaning services including deep cleaning, regular maintenance, and sanitization.','services','Cleaning',NULL,'per_unit','South Bangalore','Bangalore','Karnataka','560076','[\"https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800\", \"https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800\"]',NULL,NULL,NULL,'sqft','[]',1,0,'active',0,8,'2026-05-11 14:49:36','2026-05-11 14:49:36',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'new',NULL,NULL,NULL,NULL,'Cleaning','5 years','Mon-Sat 8AM-6PM','South Bangalore','Trained in Professional Cleaning, COVID-19 Safety Protocols','English, Hindi, Tamil',800.00,3000.00,NULL,NULL,NULL,NULL,'[]','Weekly','Lakshmi Devi','9876543217','lakshmi.cleaning@example.com','9876543217','Devi Cleaning Services','BTM Layout, Bangalore',NULL,10.00,NULL,NULL,'[]','[]','{}',NULL,0,NULL,NULL,NULL),(27,'Premium Quality Cement - ACC Brand','High-grade cement suitable for all construction needs. Fresh stock available in bulk quantities.','materials','Cement',380.00,'per_unit','Peenya Industrial Area','Bangalore','Karnataka','560058','[\"https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800\", \"https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800\"]',NULL,NULL,NULL,'sqft','[]',1,0,'active',8,8,'2026-05-11 14:49:36','2026-05-20 14:58:19',NULL,NULL,NULL,NULL,NULL,NULL,'ACC','OPC 53 Grade','new',NULL,500,'Bags (50kg each)','2024',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'[]',NULL,'Suresh Gupta','9876543218','suresh.materials@example.com','9876543218','Gupta Building Materials','Peenya Industrial Area, Bangalore',NULL,10.00,NULL,NULL,'[]','[]','{}','Premium Quality',0,NULL,NULL,NULL),(28,'Steel TMT Bars - TATA Brand','High tensile strength TMT bars for construction. Available in various sizes. Certified quality.','materials','Steel',65000.00,'per_unit','Bommanahalli','Bangalore','Karnataka','560068','[\"https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800\", \"https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800\"]',NULL,NULL,NULL,'sqft','[]',1,0,'active',0,8,'2026-05-11 14:49:36','2026-05-11 14:49:36',NULL,NULL,NULL,NULL,NULL,NULL,'TATA Steel','TMT Fe 500D','new',NULL,10,'Tonnes','2024',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'[]',NULL,'Ramesh Yadav','9876543219','ramesh.steel@example.com','9876543219','Yadav Steel Corporation','Bommanahalli, Bangalore',NULL,10.00,NULL,NULL,'[]','[]','{}','ISI Marked',0,NULL,NULL,NULL),(29,'Modern L-Shaped Sofa Set','Comfortable 6-seater L-shaped sofa in excellent condition. Perfect for living room.','furniture','Sofa & Seating',25000.00,'negotiable','Koramangala','Bangalore','Karnataka','560034','[\"https://via.placeholder.com/400x300?text=L-Shaped+Sofa\"]',NULL,NULL,NULL,'sqft','[]',0,0,'active',2,14,'2026-05-11 16:07:01','2026-05-11 16:40:02',NULL,NULL,NULL,NULL,NULL,NULL,'Urban Ladder',NULL,'like_new','2 years remaining',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'[]',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.00,NULL,NULL,'[]','[]','{}',NULL,0,NULL,NULL,NULL),(30,'Wooden Dining Table with 4 Chairs','Solid wood dining table set in good condition. Minor scratches but very sturdy.','furniture','Dining Tables',15000.00,'fixed','Indiranagar','Bangalore','Karnataka','560038','[\"https://via.placeholder.com/400x300?text=Dining+Table\"]',NULL,NULL,NULL,'sqft','[]',0,0,'active',0,14,'2026-05-11 16:07:01','2026-05-11 16:07:01',NULL,NULL,NULL,NULL,NULL,NULL,'Godrej',NULL,'good','No warranty',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'[]',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.00,NULL,NULL,'[]','[]','{}',NULL,0,NULL,NULL,NULL),(31,'King Size Bed with Mattress','Brand new king size bed with premium mattress. Never used.','furniture','Beds & Mattresses',35000.00,'fixed','Whitefield','Bangalore','Karnataka','560066','[\"https://via.placeholder.com/400x300?text=King+Size+Bed\"]',NULL,NULL,NULL,'sqft','[]',0,0,'active',0,14,'2026-05-11 16:07:01','2026-05-11 16:07:01',NULL,NULL,NULL,NULL,NULL,NULL,'IKEA',NULL,'new','5 years',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'[]',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.00,NULL,NULL,'[]','[]','{}',NULL,0,NULL,NULL,NULL),(32,'55\" 4K Smart LED TV','Samsung 55-inch 4K Smart TV in excellent condition. All accessories included.','materials','Electronics (Legacy)',45000.00,'negotiable','HSR Layout','Bangalore','Karnataka','560102','[\"https://via.placeholder.com/400x300?text=Samsung+TV\"]',NULL,NULL,NULL,'sqft','[]',0,0,'active',4,14,'2026-05-11 16:07:01','2026-05-19 15:19:43',NULL,NULL,NULL,NULL,NULL,NULL,'Samsung',NULL,'like_new','1 year remaining',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'[]',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.00,NULL,NULL,'[]','[]','{}',NULL,0,NULL,NULL,NULL),(33,'Double Door Refrigerator 300L','LG double door refrigerator in working condition. Some minor dents but functions perfectly.','materials','Electronics (Legacy)',18000.00,'negotiable','Marathahalli','Bangalore','Karnataka','560037','[\"https://via.placeholder.com/400x300?text=LG+Refrigerator\"]',NULL,NULL,NULL,'sqft','[]',0,0,'active',0,14,'2026-05-11 16:07:01','2026-05-11 16:07:01',NULL,NULL,NULL,NULL,NULL,NULL,'LG',NULL,'good','No warranty',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'[]',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.00,NULL,NULL,'[]','[]','{}',NULL,0,NULL,NULL,NULL),(34,'Front Load Washing Machine 7kg','Bosch front load washing machine, barely used. Excellent condition with all features working.','materials','Electronics (Legacy)',28000.00,'fixed','Electronic City','Bangalore','Karnataka','560100','[\"https://via.placeholder.com/400x300?text=Bosch+Washing+Machine\"]',NULL,NULL,NULL,'sqft','[]',0,0,'active',0,14,'2026-05-11 16:07:01','2026-05-11 16:07:01',NULL,NULL,NULL,NULL,NULL,NULL,'Bosch',NULL,'like_new','3 years remaining',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'[]',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.00,NULL,NULL,'[]','[]','{}',NULL,0,NULL,NULL,NULL),(35,'Professional Home Cleaning Service','Experienced home cleaning service with trained staff. Available for regular and deep cleaning.','services','Home Cleaning',500.00,'hourly','All Bangalore','Bangalore','Karnataka','560001','[\"https://via.placeholder.com/400x300?text=Home+Cleaning\"]',NULL,NULL,NULL,'sqft','[]',0,0,'active',8,14,'2026-05-11 16:07:01','2026-05-19 15:47:36',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'new',NULL,NULL,NULL,NULL,NULL,'5+ years','immediate','Bangalore',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'[]',NULL,'Cleaning Pro Services','9876543210',NULL,NULL,NULL,NULL,NULL,10.00,NULL,NULL,'[]','[]','{}',NULL,0,NULL,NULL,NULL),(36,'Expert Plumbing Services','Licensed plumber available for all types of plumbing work. Emergency services available.','services','Plumbing',800.00,'hourly','Central Bangalore','Bangalore','Karnataka','560001','[\"https://via.placeholder.com/400x300?text=Plumbing+Service\"]',NULL,NULL,NULL,'sqft','[]',0,0,'active',0,14,'2026-05-11 16:07:01','2026-05-11 16:07:01',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'new',NULL,NULL,NULL,NULL,NULL,'10+ years','emergency','Bangalore',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'[]',NULL,'Master Plumber','9876543211',NULL,NULL,NULL,NULL,NULL,10.00,NULL,NULL,'[]','[]','{}',NULL,0,NULL,NULL,NULL),(37,'AC Repair and Maintenance','Certified AC technician for repair and maintenance of all AC brands. Weekend service available.','services','AC Repair & Service',600.00,'project_based','South Bangalore','Bangalore','Karnataka','560001','[\"https://via.placeholder.com/400x300?text=AC+Repair\"]',NULL,NULL,NULL,'sqft','[]',0,0,'active',0,14,'2026-05-11 16:07:01','2026-05-11 16:07:01',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'new',NULL,NULL,NULL,NULL,NULL,'8+ years','weekend','South Bangalore',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'[]',NULL,'Cool Air Services','9876543212',NULL,NULL,NULL,NULL,NULL,10.00,NULL,NULL,'[]','[]','{}',NULL,0,NULL,NULL,NULL),(38,'Premium Quality Cement - 50kg Bags','High-grade cement suitable for all construction needs. ISI marked and certified.','materials','Cement & Concrete',350.00,'per_unit','Whitefield','Bangalore','Karnataka','560066','[\"https://via.placeholder.com/400x300?text=Premium+Cement\"]',NULL,NULL,NULL,'sqft','[]',0,0,'active',4,14,'2026-05-11 16:07:01','2026-05-20 14:59:08',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'new',NULL,100,'bags',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'[]',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.00,NULL,NULL,'[]','[]','{}','Premium Quality',0,NULL,NULL,NULL),(39,'ISI Marked Steel Rods - TMT Bars','High tensile strength TMT bars for construction. Available in various sizes.','materials','Steel & Iron Rods',55000.00,'per_unit','Peenya','Bangalore','Karnataka','560058','[\"https://via.placeholder.com/400x300?text=TMT+Steel+Rods\"]',NULL,NULL,NULL,'sqft','[]',0,0,'active',0,14,'2026-05-11 16:07:01','2026-05-11 16:07:01',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'new',NULL,50,'tonnes',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'[]',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.00,NULL,NULL,'[]','[]','{}','ISI Marked',0,NULL,NULL,NULL),(40,'Standard Quality Red Bricks','Good quality red bricks for construction. Uniform size and shape.','materials','Bricks & Blocks',8.00,'per_unit','Yelahanka','Bangalore','Karnataka','560064','[\"https://via.placeholder.com/400x300?text=Red+Bricks\"]',NULL,NULL,NULL,'sqft','[]',0,0,'active',0,14,'2026-05-11 16:07:01','2026-05-11 16:07:01',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'new',NULL,10000,'pieces',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'[]',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.00,NULL,NULL,'[]','[]','{}','Standard Quality',0,NULL,NULL,NULL),(41,'Certified River Sand - Construction Grade','Clean river sand suitable for construction and plastering work.','materials','Sand & Gravel',1200.00,'per_unit','Sarjapur','Bangalore','Karnataka','560035','[\"https://via.placeholder.com/400x300?text=River+Sand\"]',NULL,NULL,NULL,'sqft','[]',0,0,'active',0,14,'2026-05-11 16:07:01','2026-05-11 16:07:01',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'new',NULL,20,'loads',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'[]',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.00,NULL,NULL,'[]','[]','{}','Certified',0,NULL,NULL,NULL),(43,'3BHK Apartment in Whitefield','Spacious 3BHK apartment with modern amenities','property_rent','apartment',25000.00,'per_month','Whitefield, Bangalore','Bangalore','Karnataka','560066','[]',3,2,1200.00,'sqft','[]',0,0,'active',0,16,'2026-05-14 14:47:38','2026-05-14 14:47:38',NULL,NULL,NULL,NULL,NULL,'semi_furnished',NULL,NULL,'new',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'[]',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.00,NULL,NULL,'[]','[]','{}',NULL,0,NULL,NULL,NULL),(44,'2BHK Villa for Sale','Beautiful 2BHK villa with garden','property_sell','villa',5500000.00,'fixed','Electronic City, Bangalore','Bangalore','Karnataka','560100','[]',2,2,1500.00,'sqft','[]',0,0,'active',0,16,'2026-05-14 14:47:38','2026-05-14 14:47:38',NULL,NULL,NULL,NULL,NULL,'unfurnished',NULL,NULL,'new',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'[]',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.00,NULL,NULL,'[]','[]','{}',NULL,0,NULL,NULL,NULL),(45,'Commercial Space for Rent','Prime commercial space in business district','property_rent','commercial',50000.00,'per_month','MG Road, Bangalore','Bangalore','Karnataka','560001','[]',NULL,NULL,2000.00,'sqft','[]',0,0,'active',0,16,'2026-05-14 14:47:38','2026-05-14 14:47:38',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'new',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'[]',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.00,NULL,NULL,'[]','[]','{}',NULL,0,NULL,NULL,NULL),(46,'Test Property','A test property for owner dashboard','property_rent',NULL,20000.00,'per_month','Test Location','Bangalore','Karnataka','560001','[]',NULL,NULL,NULL,'sqft','[]',0,0,'active',2,18,'2026-05-14 14:50:50','2026-05-20 14:08:28',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'new',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'[]',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.00,NULL,NULL,'[]','[]','{}',NULL,0,NULL,NULL,NULL),(47,'Beautiful 3BHK Apartment','Spacious apartment with modern amenities','property_rent','apartment',25000.00,'per_month','Whitefield, Bangalore','Bangalore','Karnataka','560066','[]',3,2,1200.00,'sqft','[]',0,0,'active',0,19,'2026-05-14 15:02:44','2026-05-14 15:02:44',NULL,NULL,NULL,NULL,NULL,'semi_furnished',NULL,NULL,'new',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'[]',NULL,'John Property Owner','9876543211','propertyowner@example.com',NULL,NULL,NULL,NULL,10.00,NULL,NULL,'[]','[]','{}',NULL,0,NULL,NULL,NULL),(48,'Cozy 2BHK Villa','Spacious apartment with modern amenities','property_sell','apartment',5500000.00,'fixed','Whitefield, Bangalore','Bangalore','Karnataka','560066','[]',2,2,1200.00,'sqft','[]',0,0,'active',0,19,'2026-05-14 15:02:44','2026-05-14 15:02:44',NULL,NULL,NULL,NULL,NULL,'semi_furnished',NULL,NULL,'new',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'[]',NULL,'John Property Owner','9876543211','propertyowner@example.com',NULL,NULL,NULL,NULL,10.00,NULL,NULL,'[]','[]','{}',NULL,0,NULL,NULL,NULL),(49,'Beautiful 3BHK Apartment','Spacious apartment with modern amenities','property_rent','apartment',25000.00,'per_month','Whitefield, Bangalore','Bangalore','Karnataka','560066','[]',3,2,1200.00,'sqft','[]',0,0,'active',0,19,'2026-05-14 15:13:31','2026-05-14 15:13:31',NULL,NULL,NULL,NULL,NULL,'semi_furnished',NULL,NULL,'new',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'[]',NULL,'John Property Owner','9876543211','propertyowner@example.com',NULL,NULL,NULL,NULL,10.00,NULL,NULL,'[]','[]','{}',NULL,0,NULL,NULL,NULL),(50,'Cozy 2BHK Villa','Spacious apartment with modern amenities','property_sell','apartment',5500000.00,'fixed','Whitefield, Bangalore','Bangalore','Karnataka','560066','[]',2,2,1200.00,'sqft','[]',0,0,'active',0,19,'2026-05-14 15:13:31','2026-05-14 15:13:31',NULL,NULL,NULL,NULL,NULL,'semi_furnished',NULL,NULL,'new',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'[]',NULL,'John Property Owner','9876543211','propertyowner@example.com',NULL,NULL,NULL,NULL,10.00,NULL,NULL,'[]','[]','{}',NULL,0,NULL,NULL,NULL),(51,'3BHK Luxury Apartment in Whitefield','Spacious 3BHK apartment with modern amenities, swimming pool, gym, and 24/7 security.','property_sell','apartment',8500000.00,'fixed','Whitefield, Bangalore','Bangalore','Karnataka','560066','[]',3,2,1450.00,'sqft','[]',0,0,'active',0,20,'2026-05-14 15:27:29','2026-05-14 15:27:29',NULL,NULL,NULL,NULL,NULL,'semi_furnished',NULL,NULL,'new',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'[]',NULL,'Demo Property Owner','9876543210','demo.owner@example.com',NULL,NULL,NULL,NULL,10.00,NULL,NULL,'[]','[]','{}',NULL,0,NULL,NULL,NULL),(52,'2BHK Rental Apartment in Electronic City','Well-maintained 2BHK apartment perfect for small families, close to IT parks.','property_rent','apartment',28000.00,'per_month','Electronic City, Bangalore','Bangalore','Karnataka','560100','[]',2,2,1100.00,'sqft','[]',0,0,'active',0,20,'2026-05-14 15:27:29','2026-05-14 15:27:29',NULL,NULL,NULL,NULL,NULL,'fully_furnished',NULL,NULL,'new',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'[]',NULL,'Demo Property Owner','9876543210','demo.owner@example.com',NULL,NULL,NULL,NULL,10.00,NULL,NULL,'[]','[]','{}',NULL,0,NULL,NULL,NULL),(53,'Commercial Office Space in MG Road','Prime commercial space in the heart of Bangalore, perfect for startups and small businesses.','property_rent','commercial',75000.00,'per_month','MG Road, Bangalore','Bangalore','Karnataka','560001','[]',NULL,NULL,2500.00,'sqft','[]',0,0,'active',2,20,'2026-05-14 15:27:29','2026-05-16 02:31:04',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'new',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'[]',NULL,'Demo Property Owner','9876543210','demo.owner@example.com',NULL,NULL,NULL,NULL,10.00,NULL,NULL,'[]','[]','{}',NULL,0,NULL,NULL,NULL),(54,'Independent Villa in Sarjapur','Beautiful independent villa with garden, perfect for families looking for spacious living.','property_sell','villa',12500000.00,'fixed','Sarjapur Road, Bangalore','Bangalore','Karnataka','560035','[]',4,3,2200.00,'sqft','[]',0,0,'active',0,20,'2026-05-14 15:27:29','2026-05-14 15:27:29',NULL,NULL,NULL,NULL,NULL,'unfurnished',NULL,NULL,'new',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'[]',NULL,'Demo Property Owner','9876543210','demo.owner@example.com',NULL,NULL,NULL,NULL,10.00,NULL,NULL,'[]','[]','{}',NULL,0,NULL,NULL,NULL),(55,'3BHK Luxury Apartment in Whitefield','Spacious 3BHK apartment with modern amenities, swimming pool, gym, and 24/7 security.','property_sell','apartment',8500000.00,'fixed','Whitefield, Bangalore','Bangalore','Karnataka','560066','[]',3,2,1450.00,'sqft','[]',0,0,'active',12,20,'2026-05-14 15:28:20','2026-05-20 14:45:53',NULL,NULL,NULL,NULL,NULL,'semi_furnished',NULL,NULL,'new',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'[]',NULL,'Demo Property Owner','9876543210','demo.owner@example.com',NULL,NULL,NULL,NULL,10.00,NULL,NULL,'[]','[]','{}',NULL,0,NULL,NULL,NULL),(56,'2BHK Rental Apartment in Electronic City','Well-maintained 2BHK apartment perfect for small families, close to IT parks.','property_rent','apartment',28000.00,'per_month','Electronic City, Bangalore','Bangalore','Karnataka','560100','[]',2,2,1100.00,'sqft','[]',0,0,'active',4,20,'2026-05-14 15:28:20','2026-05-19 01:29:37',NULL,NULL,NULL,NULL,NULL,'fully_furnished',NULL,NULL,'new',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'[]',NULL,'Demo Property Owner','9876543210','demo.owner@example.com',NULL,NULL,NULL,NULL,10.00,NULL,NULL,'[]','[]','{}',NULL,0,NULL,NULL,NULL),(57,'Commercial Office Space in MG Road','Prime commercial space in the heart of Bangalore, perfect for startups and small businesses.','property_rent','commercial',75000.00,'per_month','MG Road, Bangalore','Bangalore','Karnataka','560001','[]',NULL,NULL,2500.00,'sqft','[]',0,0,'active',2,20,'2026-05-14 15:28:20','2026-05-16 02:31:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'new',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'[]',NULL,'Demo Property Owner','9876543210','demo.owner@example.com',NULL,NULL,NULL,NULL,10.00,NULL,NULL,'[]','[]','{}',NULL,0,NULL,NULL,NULL),(74,'3BHK Luxury Apartment in Downtown','Beautiful 3BHK apartment with modern amenities, spacious rooms, and great city views. Perfect for families.','property_rent','Apartment',45000.00,'per_month','Downtown Area, MG Road','Bangalore','Karnataka','560001','[]',3,2,1800.00,'sqft','[\"Parking\", \"Lift\", \"Security\", \"Power Backup\", \"Gym\", \"Swimming Pool\"]',0,0,'active',0,40,'2026-05-16 04:46:30','2026-05-16 04:46:30',NULL,NULL,5,12,'2 Car','semi-furnished',NULL,NULL,'new',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'[]',NULL,'John Doe','9876543210','john.doe@example.com',NULL,NULL,NULL,NULL,10.00,NULL,NULL,'[]','[]','{}',NULL,0,NULL,NULL,NULL),(83,'a','a','property_rent','House',1.00,'per_month','a','Chennai',NULL,NULL,'[]',NULL,NULL,NULL,'sqft','[]',1,0,'active',0,1,'2026-05-16 05:30:32','2026-05-16 05:30:32',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'new',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'[]',NULL,'brad','9090909090','brandnew@example.com',NULL,NULL,NULL,'https://res.cloudinary.com/dkupckm3c/raw/upload/v1778909428/INFRAALL/veerz4tenbst0dima8nk',1.00,NULL,NULL,'[]','[]','{}',NULL,1,NULL,NULL,4),(84,'a','a','property_rent','House',1.00,'per_month','a','Chennai',NULL,NULL,'[]',NULL,NULL,NULL,'sqft','[]',1,0,'active',0,41,'2026-05-16 05:34:41','2026-05-16 05:34:41',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'new',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'[]',NULL,'a','1234567890','prabhavathikommitreda@gmail.com',NULL,NULL,NULL,'https://res.cloudinary.com/dkupckm3c/raw/upload/v1778909673/INFRAALL/sdy9plchjnofpgtytfca',1.00,NULL,NULL,'[]','[]','{}',NULL,1,NULL,NULL,2),(85,'Kavya House','kavya house','property_rent','House',13.00,'per_month','KPHB','Hyderabad',NULL,NULL,'[]',2,1,NULL,'sqft','[]',1,0,'active',8,42,'2026-05-16 05:36:11','2026-05-20 14:17:35',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'new',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'[]',NULL,'kavya','8367060462','99220040577@klu.ac.in',NULL,NULL,NULL,'https://res.cloudinary.com/dkupckm3c/raw/upload/v1778909755/INFRAALL/a1th4sz630xcl6hsd7y4',0.90,NULL,NULL,'[]','[]','{}',NULL,1,NULL,NULL,5),(86,'Kavya House','kavya house','property_rent','House',13.00,'per_month','KPHB','Hyderabad',NULL,NULL,'[]',2,1,NULL,'sqft','[]',1,0,'active',9,42,'2026-05-16 05:36:16','2026-05-20 14:14:55',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'new',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'[]',NULL,'kavya','8367060462','99220040577@klu.ac.in',NULL,NULL,NULL,'https://res.cloudinary.com/dkupckm3c/raw/upload/v1778909773/INFRAALL/o3fbyokabwyxh1mylsoj',0.90,NULL,NULL,'[]','[]','{}',NULL,1,NULL,NULL,5),(88,'Prabhavathi Hpuse','good','property_rent','House',12.00,'per_month','near Beach Kollam','Noida',NULL,NULL,'[]',3,2,NULL,'sqft','[\"Play Area\"]',1,1,'active',0,42,'2026-05-20 14:28:10','2026-05-20 14:28:10',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'new',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'[]',NULL,'Kavya','8367060762','99220040577@klu.ac.in',NULL,NULL,NULL,'https://res.cloudinary.com/dkupckm3c/raw/upload/v1779287290/INFRAALL/e3dtol4tt1no3qdbzvvf',2.00,NULL,NULL,'[\"https://res.cloudinary.com/dkupckm3c/raw/upload/v1779287285/INFRAALL/qhub6kbh5blihgjvjgjs\"]','[]','{}',NULL,1,NULL,NULL,2);
/*!40000 ALTER TABLE `listings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `messages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `senderId` int NOT NULL,
  `receiverId` int NOT NULL,
  `listingId` int DEFAULT NULL,
  `isRead` tinyint(1) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `message` text NOT NULL,
  PRIMARY KEY (`id`),
  KEY `senderId` (`senderId`),
  KEY `receiverId` (`receiverId`),
  KEY `listingId` (`listingId`),
  CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_10` FOREIGN KEY (`receiverId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_100` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_101` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_102` FOREIGN KEY (`receiverId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_103` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_104` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_105` FOREIGN KEY (`receiverId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_106` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_107` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_108` FOREIGN KEY (`receiverId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_109` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_11` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_110` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_111` FOREIGN KEY (`receiverId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_112` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_113` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_114` FOREIGN KEY (`receiverId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_115` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_116` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_117` FOREIGN KEY (`receiverId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_118` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_119` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_12` FOREIGN KEY (`receiverId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_120` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_121` FOREIGN KEY (`receiverId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_122` FOREIGN KEY (`receiverId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_123` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_124` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_125` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_126` FOREIGN KEY (`receiverId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_127` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_128` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_129` FOREIGN KEY (`receiverId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_13` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_130` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_131` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_132` FOREIGN KEY (`receiverId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_133` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_134` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_135` FOREIGN KEY (`receiverId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_136` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_137` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_138` FOREIGN KEY (`receiverId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_139` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_14` FOREIGN KEY (`receiverId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_140` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_141` FOREIGN KEY (`receiverId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_142` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_15` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_16` FOREIGN KEY (`receiverId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_17` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_18` FOREIGN KEY (`receiverId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_19` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`receiverId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_20` FOREIGN KEY (`receiverId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_21` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_22` FOREIGN KEY (`receiverId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_23` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_24` FOREIGN KEY (`receiverId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_25` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_26` FOREIGN KEY (`receiverId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_27` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_28` FOREIGN KEY (`receiverId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_29` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_3` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_30` FOREIGN KEY (`receiverId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_31` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_32` FOREIGN KEY (`receiverId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_33` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_34` FOREIGN KEY (`receiverId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_35` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_36` FOREIGN KEY (`receiverId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_37` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_38` FOREIGN KEY (`receiverId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_39` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_4` FOREIGN KEY (`receiverId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_40` FOREIGN KEY (`receiverId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_41` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_42` FOREIGN KEY (`receiverId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_43` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_44` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_45` FOREIGN KEY (`receiverId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_46` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_47` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_48` FOREIGN KEY (`receiverId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_49` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_5` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_50` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_51` FOREIGN KEY (`receiverId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_52` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_53` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_54` FOREIGN KEY (`receiverId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_55` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_56` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_57` FOREIGN KEY (`receiverId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_58` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_59` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_6` FOREIGN KEY (`receiverId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_60` FOREIGN KEY (`receiverId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_61` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_62` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_63` FOREIGN KEY (`receiverId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_64` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_65` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_66` FOREIGN KEY (`receiverId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_67` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_68` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_69` FOREIGN KEY (`receiverId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_7` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_70` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_71` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_72` FOREIGN KEY (`receiverId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_73` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_74` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_75` FOREIGN KEY (`receiverId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_76` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_77` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_78` FOREIGN KEY (`receiverId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_79` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_8` FOREIGN KEY (`receiverId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_80` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_81` FOREIGN KEY (`receiverId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_82` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_83` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_84` FOREIGN KEY (`receiverId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_85` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_86` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_87` FOREIGN KEY (`receiverId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_88` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_89` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_9` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_90` FOREIGN KEY (`receiverId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_91` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_92` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_93` FOREIGN KEY (`receiverId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_94` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_95` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_96` FOREIGN KEY (`receiverId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_97` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_98` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_99` FOREIGN KEY (`receiverId`) REFERENCES `users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
INSERT INTO `messages` VALUES (12,43,1,55,0,'2026-05-20 14:24:23','2026-05-20 14:24:23','hi');
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `monthly_payments`
--

DROP TABLE IF EXISTS `monthly_payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `monthly_payments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `rentalId` int NOT NULL,
  `userId` int NOT NULL,
  `monthNumber` int NOT NULL COMMENT 'Month number in the rental contract (1, 2, 3, etc.)',
  `monthYear` varchar(7) NOT NULL COMMENT 'Month and year for this payment (YYYY-MM)',
  `amount` decimal(15,2) NOT NULL COMMENT 'Monthly rent amount',
  `dueDate` date NOT NULL COMMENT 'Payment due date',
  `paidDate` date DEFAULT NULL COMMENT 'Date when payment was made',
  `status` enum('pending','paid','overdue','waived') DEFAULT 'pending' COMMENT 'Payment status',
  `paymentMethod` varchar(255) DEFAULT NULL COMMENT 'Payment method used',
  `razorpayOrderId` varchar(255) DEFAULT NULL,
  `razorpayPaymentId` varchar(255) DEFAULT NULL,
  `razorpaySignature` varchar(255) DEFAULT NULL,
  `lateFee` decimal(15,2) DEFAULT '0.00' COMMENT 'Late payment fee if applicable',
  `totalAmount` decimal(15,2) NOT NULL COMMENT 'Total amount including late fees',
  `notes` text COMMENT 'Payment notes or remarks',
  `notificationSent` tinyint(1) DEFAULT '0' COMMENT 'Whether payment reminder notification was sent',
  `reminderCount` int DEFAULT '0' COMMENT 'Number of reminders sent',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `monthly_payments_rental_id_month_number` (`rentalId`,`monthNumber`),
  KEY `monthly_payments_user_id_status` (`userId`,`status`),
  KEY `monthly_payments_due_date_status` (`dueDate`,`status`),
  CONSTRAINT `monthly_payments_ibfk_1` FOREIGN KEY (`rentalId`) REFERENCES `property_rentals` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `monthly_payments_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `monthly_payments`
--

LOCK TABLES `monthly_payments` WRITE;
/*!40000 ALTER TABLE `monthly_payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `monthly_payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `property_rentals`
--

DROP TABLE IF EXISTS `property_rentals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `property_rentals` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `listingId` int NOT NULL,
  `startDate` date NOT NULL,
  `endDate` date DEFAULT NULL COMMENT 'End date (set when tenant vacates)',
  `monthlyRent` decimal(15,2) NOT NULL,
  `securityDeposit` decimal(15,2) DEFAULT NULL,
  `totalAmount` decimal(15,2) NOT NULL,
  `status` enum('pending','active','completed','cancelled') DEFAULT 'pending',
  `paymentStatus` enum('pending','partial','paid','overdue') DEFAULT 'pending',
  `razorpayOrderId` varchar(255) DEFAULT NULL,
  `razorpayPaymentId` varchar(255) DEFAULT NULL,
  `razorpaySignature` varchar(255) DEFAULT NULL,
  `tenantPhone` varchar(255) DEFAULT NULL,
  `tenantEmail` varchar(255) DEFAULT NULL,
  `notes` text,
  `adminNotes` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `advancePayment` decimal(15,2) DEFAULT '0.00' COMMENT '2 months advance payment',
  `firstMonthRent` decimal(15,2) DEFAULT '0.00' COMMENT 'First month rent',
  `initialPayment` decimal(15,2) DEFAULT '0.00' COMMENT 'Total upfront payment (advance + first month)',
  `nextPaymentDue` date DEFAULT NULL COMMENT 'Next monthly payment due date',
  `lastPaymentDate` date DEFAULT NULL COMMENT 'Last payment received date',
  `monthlyPaymentStatus` enum('current','due','overdue','completed') DEFAULT 'current' COMMENT 'Current monthly payment status',
  `vacateRequested` tinyint(1) DEFAULT '0' COMMENT 'Whether tenant has requested to vacate',
  `vacateDate` date DEFAULT NULL COMMENT 'Date when tenant will vacate',
  `vacateReason` text COMMENT 'Reason for vacating (optional)',
  `paidUntilDate` date DEFAULT NULL COMMENT 'Date until which rent is paid (prepaid system)',
  `paymentDayOfMonth` int DEFAULT NULL COMMENT 'Day of month when rent is due (e.g., 4 for 4th of every month)',
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  KEY `listingId` (`listingId`),
  CONSTRAINT `property_rentals_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `property_rentals_ibfk_2` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `property_rentals`
--

LOCK TABLES `property_rentals` WRITE;
/*!40000 ALTER TABLE `property_rentals` DISABLE KEYS */;
INSERT INTO `property_rentals` VALUES (22,2,14,'2026-04-11','2026-05-11',15000.00,NULL,180000.00,'completed','paid',NULL,NULL,NULL,'+91-9876543210','sivaprasad072611@gmail.com','Sample rental for testing reviews',NULL,'2026-05-11 15:00:30','2026-05-11 15:53:54',30000.00,15000.00,45000.00,NULL,NULL,'completed',0,'2026-05-11',NULL,'2026-05-11',11),(23,3,15,'2026-04-11','2026-05-11',16000.00,NULL,192000.00,'completed','paid',NULL,NULL,NULL,'','gollapallilikki@gmail.com','Sample rental for testing reviews',NULL,'2026-05-11 15:00:30','2026-05-11 15:53:55',32000.00,16000.00,48000.00,NULL,NULL,'completed',0,'2026-05-11',NULL,'2026-05-11',11),(24,4,16,'2026-04-11',NULL,25000.00,NULL,300000.00,'active','paid',NULL,NULL,NULL,'1234567890','test@example.com','Sample rental for testing reviews',NULL,'2026-05-11 15:00:30','2026-05-11 15:00:30',50000.00,25000.00,75000.00,NULL,NULL,'current',0,NULL,NULL,'2026-06-10',11),(25,5,17,'2026-04-11',NULL,13000.00,NULL,156000.00,'active','paid',NULL,NULL,NULL,'9876543210','kyctest@example.com','Sample rental for testing reviews',NULL,'2026-05-11 15:00:30','2026-05-11 15:00:30',26000.00,13000.00,39000.00,NULL,NULL,'current',0,NULL,NULL,'2026-06-10',11),(28,2,17,'2026-03-11','2026-05-04',13000.00,NULL,2600013000.00,'completed','paid','order_1778514835021_4','pay_1778514835021_4',NULL,'+91-9876543210','sivaprasad072611@gmail.com',NULL,'Sample completed rental for review testing','2026-05-11 15:53:55','2026-05-11 15:53:55',26000.00,13000.00,2600013000.00,NULL,NULL,'completed',0,'2026-05-04','Completed rental period','2026-05-04',11),(29,2,2,'2026-04-11',NULL,14000.00,NULL,2800014000.00,'active','paid','order_active_1778514835029_0','pay_active_1778514835029_0',NULL,'+91-9876543210','sivaprasad072611@gmail.com',NULL,'Sample active rental for review testing','2026-05-11 15:53:55','2026-05-11 15:53:55',28000.00,14000.00,2800014000.00,NULL,NULL,'current',0,NULL,NULL,'2026-06-11',11),(30,3,14,'2026-04-11',NULL,15000.00,NULL,3000015000.00,'active','paid','order_active_1778514835037_1','pay_active_1778514835037_1',NULL,'','gollapallilikki@gmail.com',NULL,'Sample active rental for review testing','2026-05-11 15:53:55','2026-05-11 15:53:55',30000.00,15000.00,3000015000.00,NULL,NULL,'current',0,NULL,NULL,'2026-06-11',11),(33,3,85,'2026-05-20',NULL,13.00,NULL,39.00,'pending','pending','order_Sre8RwE5U22P8a',NULL,NULL,NULL,NULL,NULL,NULL,'2026-05-20 14:09:53','2026-05-20 14:09:53',26.00,13.00,39.00,'2026-07-20',NULL,'current',0,NULL,NULL,'2026-06-20',20);
/*!40000 ALTER TABLE `property_rentals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `property_requests`
--

DROP TABLE IF EXISTS `property_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `property_requests` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ownerName` varchar(255) NOT NULL,
  `ownerEmail` varchar(255) NOT NULL,
  `ownerPhone` varchar(255) NOT NULL,
  `listingType` enum('property_sell','property_rent') NOT NULL,
  `title` varchar(255) NOT NULL,
  `address` text NOT NULL,
  `city` varchar(255) NOT NULL,
  `price` decimal(12,2) DEFAULT NULL,
  `bedrooms` int DEFAULT NULL,
  `bathrooms` int DEFAULT NULL,
  `area` varchar(255) DEFAULT NULL,
  `description` text,
  `photos` json DEFAULT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `adminNotes` text,
  `userId` int DEFAULT NULL,
  `listingId` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `property_requests_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `property_requests`
--

LOCK TABLES `property_requests` WRITE;
/*!40000 ALTER TABLE `property_requests` DISABLE KEYS */;
/*!40000 ALTER TABLE `property_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `purchases`
--

DROP TABLE IF EXISTS `purchases`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `purchases` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `listingId` int NOT NULL,
  `category` enum('property_sell','furniture','materials','electronics','vehicles') NOT NULL,
  `quantity` int DEFAULT '1',
  `unitPrice` decimal(15,2) NOT NULL,
  `totalAmount` decimal(15,2) NOT NULL,
  `status` enum('pending','admin_review','approved','documents_required','documents_submitted','documents_verified','confirmed','processing','shipped','delivered','completed','cancelled','rejected') DEFAULT 'pending',
  `paymentStatus` enum('pending','paid','failed','refunded') DEFAULT 'pending',
  `razorpayOrderId` varchar(255) DEFAULT NULL,
  `razorpayPaymentId` varchar(255) DEFAULT NULL,
  `razorpaySignature` varchar(255) DEFAULT NULL,
  `deliveryAddress` text,
  `deliveryCity` varchar(255) DEFAULT NULL,
  `deliveryState` varchar(255) DEFAULT NULL,
  `deliveryPincode` varchar(255) DEFAULT NULL,
  `deliveryPhone` varchar(255) DEFAULT NULL,
  `buyerName` varchar(255) DEFAULT NULL,
  `buyerEmail` varchar(255) DEFAULT NULL,
  `buyerPhone` varchar(255) DEFAULT NULL,
  `notes` text,
  `adminNotes` text,
  `registrationDate` date DEFAULT NULL,
  `possessionDate` date DEFAULT NULL,
  `trackingNumber` varchar(255) DEFAULT NULL,
  `estimatedDelivery` date DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `purchaseDocuments` json DEFAULT NULL,
  `documentStatus` enum('not_required','pending','submitted','verified','rejected') DEFAULT 'not_required',
  `documentNotes` text,
  `documentSubmittedAt` datetime DEFAULT NULL,
  `documentVerifiedAt` datetime DEFAULT NULL,
  `rentalType` enum('buy','rent') DEFAULT 'buy',
  `purpose` enum('home','office','other') DEFAULT NULL,
  `rentalDuration` int DEFAULT NULL,
  `vacateRequested` tinyint(1) DEFAULT '0' COMMENT 'Whether user has requested to vacate/return furniture',
  `vacateDate` date DEFAULT NULL COMMENT 'Requested vacate/return date',
  `vacateReason` text COMMENT 'Reason for vacate/return request',
  `rentalStartDate` date DEFAULT NULL COMMENT 'Start date of furniture rental',
  `rentalEndDate` date DEFAULT NULL COMMENT 'End date of furniture rental',
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  KEY `listingId` (`listingId`),
  CONSTRAINT `purchases_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `purchases_ibfk_2` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `purchases`
--

LOCK TABLES `purchases` WRITE;
/*!40000 ALTER TABLE `purchases` DISABLE KEYS */;
INSERT INTO `purchases` VALUES (6,3,7,'furniture',1,13999.00,13999.00,'completed','paid',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Likhotha','gollapallilikki@gmail.com','','Sample purchase for testing reviews - furniture',NULL,NULL,NULL,NULL,NULL,'2026-05-11 15:00:30','2026-05-11 15:00:30','[]','not_required',NULL,NULL,NULL,'buy',NULL,NULL,0,NULL,NULL,NULL,NULL),(7,4,8,'furniture',1,2500.00,2500.00,'completed','paid',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Test User','test@example.com','1234567890','Sample purchase for testing reviews - furniture',NULL,NULL,NULL,NULL,NULL,'2026-05-11 15:00:30','2026-05-11 15:00:30','[]','not_required',NULL,NULL,NULL,'buy',NULL,NULL,0,NULL,NULL,NULL,NULL),(8,5,9,'property_sell',1,999999.00,999999.00,'completed','paid',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'KYC Test User','kyctest@example.com','9876543210','Sample purchase for testing reviews - property_sell',NULL,NULL,NULL,NULL,NULL,'2026-05-11 15:00:30','2026-05-11 15:00:30','[]','not_required',NULL,NULL,NULL,'buy',NULL,NULL,0,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `purchases` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rent_notifications`
--

DROP TABLE IF EXISTS `rent_notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rent_notifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `rentalAgreementId` int NOT NULL,
  `tenantId` int NOT NULL,
  `type` enum('rent_due','rent_overdue','late_payment_warning','vacate_notice','payment_reminder') NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `forMonth` varchar(255) DEFAULT NULL,
  `dueAmount` decimal(10,2) DEFAULT NULL,
  `overdueMonths` int DEFAULT '0',
  `status` enum('sent','read','acknowledged') DEFAULT 'sent',
  `sentVia` json DEFAULT NULL,
  `scheduledFor` datetime DEFAULT NULL,
  `sentAt` datetime DEFAULT NULL,
  `readAt` datetime DEFAULT NULL,
  `acknowledgedAt` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `rentalAgreementId` (`rentalAgreementId`),
  KEY `tenantId` (`tenantId`),
  CONSTRAINT `rent_notifications_ibfk_1` FOREIGN KEY (`rentalAgreementId`) REFERENCES `rental_agreements` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `rent_notifications_ibfk_2` FOREIGN KEY (`tenantId`) REFERENCES `users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rent_notifications`
--

LOCK TABLES `rent_notifications` WRITE;
/*!40000 ALTER TABLE `rent_notifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `rent_notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rent_payments`
--

DROP TABLE IF EXISTS `rent_payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rent_payments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `rentalAgreementId` int NOT NULL,
  `tenantId` int NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `paymentDate` datetime NOT NULL,
  `forMonth` varchar(255) NOT NULL,
  `paymentMethod` enum('cash','bank_transfer','upi','cheque','online') DEFAULT 'online',
  `transactionId` varchar(255) DEFAULT NULL,
  `status` enum('pending','completed','failed') DEFAULT 'completed',
  `receiptUrl` varchar(255) DEFAULT NULL,
  `lateFee` decimal(10,2) DEFAULT '0.00',
  `notes` text,
  `paidBy` enum('tenant','owner','admin') DEFAULT 'tenant',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `rentalAgreementId` (`rentalAgreementId`),
  KEY `tenantId` (`tenantId`),
  CONSTRAINT `rent_payments_ibfk_1` FOREIGN KEY (`rentalAgreementId`) REFERENCES `rental_agreements` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `rent_payments_ibfk_2` FOREIGN KEY (`tenantId`) REFERENCES `users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rent_payments`
--

LOCK TABLES `rent_payments` WRITE;
/*!40000 ALTER TABLE `rent_payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `rent_payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rental_agreements`
--

DROP TABLE IF EXISTS `rental_agreements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rental_agreements` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tenantId` int NOT NULL,
  `propertyId` int NOT NULL,
  `ownerId` int NOT NULL,
  `monthlyRent` decimal(10,2) NOT NULL,
  `securityDeposit` decimal(10,2) NOT NULL,
  `agreementStartDate` datetime NOT NULL,
  `agreementEndDate` datetime NOT NULL,
  `rentDueDate` int NOT NULL DEFAULT '1',
  `status` enum('active','terminated','expired') DEFAULT 'active',
  `agreementDocument` varchar(255) DEFAULT NULL,
  `terms` text,
  `lastRentPaidDate` datetime DEFAULT NULL,
  `nextRentDueDate` datetime NOT NULL,
  `overdueMonths` int DEFAULT '0',
  `warningsSent` int DEFAULT '0',
  `vacateNoticeSent` tinyint(1) DEFAULT '0',
  `vacateNoticeDate` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `tenantId` (`tenantId`),
  KEY `propertyId` (`propertyId`),
  KEY `ownerId` (`ownerId`),
  CONSTRAINT `rental_agreements_ibfk_1` FOREIGN KEY (`tenantId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `rental_agreements_ibfk_2` FOREIGN KEY (`propertyId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `rental_agreements_ibfk_3` FOREIGN KEY (`ownerId`) REFERENCES `users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rental_agreements`
--

LOCK TABLES `rental_agreements` WRITE;
/*!40000 ALTER TABLE `rental_agreements` DISABLE KEYS */;
/*!40000 ALTER TABLE `rental_agreements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rental_notifications`
--

DROP TABLE IF EXISTS `rental_notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rental_notifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `rentalId` int NOT NULL,
  `userId` int NOT NULL,
  `notificationType` varchar(50) NOT NULL,
  `message` text NOT NULL,
  `sentAt` datetime NOT NULL,
  `method` enum('sms','email','push') DEFAULT 'sms',
  `status` enum('sent','failed','pending') DEFAULT 'sent',
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_rental_id` (`rentalId`),
  KEY `idx_user_id` (`userId`),
  KEY `idx_sent_at` (`sentAt`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rental_notifications`
--

LOCK TABLES `rental_notifications` WRITE;
/*!40000 ALTER TABLE `rental_notifications` DISABLE KEYS */;
INSERT INTO `rental_notifications` VALUES (1,8,3,'expiry_today','FINAL NOTICE: Likhotha, your rental for Siva House expires TODAY. Pay Ôé╣14000.00 immediately to continue. Login: http://localhost:5173','2026-05-04 12:59:50','sms','sent','2026-05-04 12:59:50'),(2,10,1,'expiry_today','FINAL NOTICE: siva, your rental for Siva House expires TODAY. Pay Ôé╣14000.00 immediately to continue. Login: http://localhost:5173','2026-05-04 12:59:50','sms','sent','2026-05-04 12:59:50');
/*!40000 ALTER TABLE `rental_notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `id` int NOT NULL AUTO_INCREMENT,
  `rating` int NOT NULL,
  `comment` text,
  `userId` int NOT NULL,
  `listingId` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `transactionType` enum('purchase','rental','service') DEFAULT NULL COMMENT 'Type of transaction that enabled this review',
  `isVerified` tinyint(1) DEFAULT '1' COMMENT 'Whether this review is from a verified transaction',
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  KEY `listingId` (`listingId`),
  CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_10` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_100` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_101` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_102` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_103` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_104` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_105` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_106` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_11` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_12` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_13` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_14` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_15` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_16` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_17` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_18` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_19` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_20` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_21` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_22` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_23` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_24` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_25` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_26` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_27` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_28` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_29` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_3` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_30` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_31` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_32` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_33` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_34` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_35` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_36` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_37` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_38` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_39` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_4` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_40` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_41` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_42` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_43` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_44` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_45` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_46` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_47` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_48` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_49` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_5` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_50` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_51` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_52` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_53` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_54` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_55` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_56` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_57` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_58` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_59` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_6` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_60` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_61` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_62` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_63` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_64` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_65` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_66` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_67` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_68` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_69` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_7` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_70` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_71` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_72` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_73` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_74` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_75` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_76` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_77` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_78` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_79` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_8` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_80` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_81` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_82` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_83` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_84` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_85` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_86` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_87` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_88` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_89` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_9` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_90` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_91` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_92` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_93` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_94` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_95` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_96` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_97` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_98` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_99` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `servicerequests`
--

DROP TABLE IF EXISTS `servicerequests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `servicerequests` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `serviceType` varchar(255) NOT NULL COMMENT 'Type of service: Plumbing, Electrical, Carpentry, etc.',
  `problemDescription` text NOT NULL COMMENT 'User describes their problem',
  `userPhone` varchar(255) NOT NULL COMMENT 'User contact phone',
  `userAddress` text NOT NULL COMMENT 'User address',
  `status` enum('pending','assigned','completed','cancelled') DEFAULT 'pending',
  `workerName` varchar(255) DEFAULT NULL COMMENT 'Name of assigned worker',
  `workerPhone` varchar(255) DEFAULT NULL COMMENT 'Phone of assigned worker',
  `adminNotes` text COMMENT 'Internal notes by admin',
  `vendorId` int DEFAULT NULL COMMENT 'Registered vendor assigned by admin (vendor portal)',
  `assignedAt` datetime DEFAULT NULL COMMENT 'When admin assigned the job to a vendor',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `paymentType` enum('subscription','one_time') DEFAULT 'one_time' COMMENT 'How user paid: subscription or one-time payment',
  `paymentAmount` decimal(10,2) DEFAULT '149.00' COMMENT 'Amount paid for this request (Ôé╣149 for one-time, Ôé╣0 for subscription)',
  `subscriptionId` int DEFAULT NULL COMMENT 'If paid via subscription, link to subscription ID',
  `razorpayOrderId` varchar(255) DEFAULT NULL COMMENT 'Razorpay order ID for one-time payments',
  `razorpayPaymentId` varchar(255) DEFAULT NULL COMMENT 'Razorpay payment ID for one-time payments',
  `paymentStatus` enum('pending','paid','failed') DEFAULT 'pending' COMMENT 'Payment status for one-time payments',
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  KEY `vendorId` (`vendorId`),
  CONSTRAINT `servicerequests_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `servicerequests_ibfk_2` FOREIGN KEY (`vendorId`) REFERENCES `vendors` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `servicerequests`
--

LOCK TABLES `servicerequests` WRITE;
/*!40000 ALTER TABLE `servicerequests` DISABLE KEYS */;
INSERT INTO `servicerequests` VALUES (1,15,'Plumbing','water problem','8497967020','Gachibowli','pending',NULL,NULL,NULL,NULL,NULL,'2026-05-14 14:19:42','2026-05-14 14:19:42','one_time',149.00,NULL,NULL,NULL,'pending'),(2,15,'Plumbing','water problem','8497967020','Gachibowli','pending',NULL,NULL,NULL,NULL,NULL,'2026-05-14 14:20:00','2026-05-14 14:20:00','one_time',149.00,NULL,NULL,NULL,'pending'),(3,15,'Maid Service','miad servuce','8497967020','Gachibowli','pending',NULL,NULL,NULL,NULL,NULL,'2026-05-14 14:20:46','2026-05-14 14:20:46','one_time',149.00,NULL,NULL,NULL,'pending'),(6,3,'Plumbing','water leakge','8497967020','Naiduvaripalli','completed','Materials Vendor','9876543210','',1,'2026-05-14 14:28:22','2026-05-14 14:26:29','2026-05-20 14:49:01','one_time',149.00,NULL,NULL,NULL,'pending'),(7,43,'Plumbing','water leakge','8989898989','Chennai','completed','Prabhavathi','7095792399','',4,'2026-05-20 14:46:57','2026-05-20 14:45:33','2026-05-20 15:03:03','one_time',149.00,NULL,NULL,NULL,'pending'),(8,43,'Home Cleaning','plum wor','8497967020','Chennai','pending',NULL,NULL,NULL,NULL,NULL,'2026-05-20 15:40:49','2026-05-20 15:40:49','one_time',149.00,NULL,NULL,NULL,'pending'),(9,43,'Home Cleaning','plum wor','8497967020','Chennai','pending',NULL,NULL,NULL,NULL,NULL,'2026-05-20 15:41:04','2026-05-20 15:41:04','one_time',149.00,NULL,NULL,NULL,'pending'),(10,43,'Home Cleaning','plum wor','8497967020','Chennai','pending',NULL,NULL,NULL,NULL,NULL,'2026-05-20 15:44:01','2026-05-20 15:44:01','one_time',149.00,NULL,NULL,NULL,'pending'),(11,43,'Home Cleaning','plum','8497967020','chennai','pending',NULL,NULL,NULL,NULL,NULL,'2026-05-20 15:44:20','2026-05-20 15:44:20','one_time',149.00,NULL,NULL,NULL,'pending'),(12,43,'Home Cleaning','aa','8497967020','aa','pending',NULL,NULL,NULL,NULL,NULL,'2026-05-20 16:12:38','2026-05-20 16:12:38','one_time',149.00,NULL,'order_SrgDTryFrQC1EL','pay_SrgDq28y9g9UfH','paid'),(13,43,'Home Cleaning','aa','8497967020','aa','pending',NULL,NULL,NULL,NULL,NULL,'2026-05-20 16:19:35','2026-05-20 16:19:35','subscription',0.00,3,NULL,NULL,'paid'),(14,3,'AC Repair','ac repar','2342342342','chennai','pending',NULL,NULL,NULL,NULL,NULL,'2026-05-20 16:46:58','2026-05-20 16:46:58','one_time',149.00,NULL,'order_Srgnn4m7laSLT8','pay_SrgnyiFyEyOwBO','paid');
/*!40000 ALTER TABLE `servicerequests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subscriptions`
--

DROP TABLE IF EXISTS `subscriptions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subscriptions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `packageType` enum('basic','premium','enterprise','home_services_weekly','home_services_monthly','home_services_yearly') NOT NULL,
  `amount` int NOT NULL,
  `startDate` datetime NOT NULL,
  `endDate` datetime NOT NULL,
  `status` enum('active','expired','cancelled') DEFAULT 'active',
  `razorpayOrderId` varchar(255) DEFAULT NULL,
  `razorpayPaymentId` varchar(255) DEFAULT NULL,
  `razorpaySignature` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `subscriptions_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subscriptions`
--

LOCK TABLES `subscriptions` WRITE;
/*!40000 ALTER TABLE `subscriptions` DISABLE KEYS */;
INSERT INTO `subscriptions` VALUES (2,1,'home_services_monthly',499,'2026-05-20 15:38:30','2026-06-19 15:38:30','active','test_order_1779291510947','test_payment_1779291510947','test_signature','2026-05-20 15:38:30','2026-05-20 15:38:30'),(3,43,'home_services_monthly',49900,'2026-05-20 16:19:35','2026-06-20 16:19:35','active','order_SrgL6LBPUBwGL2','pay_SrgLBqwTduMscm','421e0f9cb0ca396d7d53903a909be6f01382a98848ef9219ddc303681e215b28','2026-05-20 16:19:35','2026-05-20 16:19:35');
/*!40000 ALTER TABLE `subscriptions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `isVerified` tinyint(1) DEFAULT '0',
  `role` enum('user','seller','admin') DEFAULT 'user',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `passwordSetupToken` varchar(255) DEFAULT NULL,
  `passwordSetupExpiry` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `email_2` (`email`),
  UNIQUE KEY `email_3` (`email`),
  UNIQUE KEY `email_4` (`email`),
  UNIQUE KEY `email_5` (`email`),
  UNIQUE KEY `email_6` (`email`),
  UNIQUE KEY `email_7` (`email`),
  UNIQUE KEY `email_8` (`email`),
  UNIQUE KEY `email_9` (`email`),
  UNIQUE KEY `email_10` (`email`),
  UNIQUE KEY `email_11` (`email`),
  UNIQUE KEY `email_12` (`email`),
  UNIQUE KEY `email_13` (`email`),
  UNIQUE KEY `email_14` (`email`),
  UNIQUE KEY `email_15` (`email`),
  UNIQUE KEY `email_16` (`email`),
  UNIQUE KEY `email_17` (`email`),
  UNIQUE KEY `email_18` (`email`),
  UNIQUE KEY `email_19` (`email`),
  UNIQUE KEY `email_20` (`email`),
  UNIQUE KEY `email_21` (`email`),
  UNIQUE KEY `email_22` (`email`),
  UNIQUE KEY `email_23` (`email`),
  UNIQUE KEY `email_24` (`email`),
  UNIQUE KEY `email_25` (`email`),
  UNIQUE KEY `email_26` (`email`),
  UNIQUE KEY `email_27` (`email`),
  UNIQUE KEY `email_28` (`email`),
  UNIQUE KEY `email_29` (`email`),
  UNIQUE KEY `email_30` (`email`),
  UNIQUE KEY `email_31` (`email`),
  UNIQUE KEY `email_32` (`email`),
  UNIQUE KEY `email_33` (`email`),
  UNIQUE KEY `email_34` (`email`),
  UNIQUE KEY `email_35` (`email`),
  UNIQUE KEY `email_36` (`email`),
  UNIQUE KEY `email_37` (`email`),
  UNIQUE KEY `email_38` (`email`),
  UNIQUE KEY `email_39` (`email`),
  UNIQUE KEY `email_40` (`email`),
  UNIQUE KEY `email_41` (`email`),
  UNIQUE KEY `email_42` (`email`),
  UNIQUE KEY `email_43` (`email`),
  UNIQUE KEY `email_44` (`email`),
  UNIQUE KEY `email_45` (`email`),
  UNIQUE KEY `email_46` (`email`),
  UNIQUE KEY `email_47` (`email`),
  UNIQUE KEY `email_48` (`email`),
  UNIQUE KEY `email_49` (`email`),
  UNIQUE KEY `email_50` (`email`),
  UNIQUE KEY `email_51` (`email`),
  UNIQUE KEY `email_52` (`email`),
  UNIQUE KEY `email_53` (`email`),
  UNIQUE KEY `email_54` (`email`),
  UNIQUE KEY `email_55` (`email`),
  UNIQUE KEY `email_56` (`email`),
  UNIQUE KEY `email_57` (`email`),
  UNIQUE KEY `email_58` (`email`),
  UNIQUE KEY `email_59` (`email`),
  UNIQUE KEY `email_60` (`email`),
  UNIQUE KEY `email_61` (`email`),
  UNIQUE KEY `email_62` (`email`),
  UNIQUE KEY `email_63` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Dummy User','dummy@temp.com','$2b$10$NHWFMk/xRZ8Fi.9Xz4ZmEe3Lv47owRkUdtTP2lM3ma4LQNWRKjg3q',NULL,NULL,1,'user','2026-05-16 05:28:25','2026-05-16 05:28:25',NULL,NULL),(2,'Siva Prasad','sivaprasad072611@gmail.com','Admin@123456','+91-9876543210',NULL,1,'admin','2026-04-24 14:15:10','2026-04-24 14:15:10',NULL,NULL),(3,'Likhotha','gollapallilikki@gmail.com','$2b$10$At271wI3BFPwOCraGLjoV.yWj/Tq403BqPNXY.2peLpf40jvfGqTu','',NULL,1,'user','2026-04-24 14:42:31','2026-04-24 16:47:16',NULL,NULL),(4,'Test User','test@example.com','$2b$10$Y7cj5/ljPftA2QCaxfTQfe52x2ZQH6Y.6/XdXtIoP6Aztvft5ogOK','1234567890',NULL,0,'user','2026-05-04 12:42:32','2026-05-04 12:42:32',NULL,NULL),(5,'KYC Test User','kyctest@example.com','$2b$10$0qfONNSaLW2bep6xhpNtU.95BmRMFO5pJDrvZfUxWrsKlxyfSKY2C','9876543210',NULL,1,'user','2026-05-04 12:43:42','2026-05-11 15:31:32',NULL,NULL),(8,'Test User','testuser@example.com','$2a$10$example.hash.here','9876543200',NULL,1,'user','2026-05-11 14:49:36','2026-05-11 14:49:36',NULL,NULL),(9,'Arjun Mehta','arjun@example.com','$2a$10$example.hash.here','9876543301',NULL,1,'user','2026-05-11 15:00:42','2026-05-11 15:00:42',NULL,NULL),(10,'Sneha Patel','sneha@example.com','$2a$10$example.hash.here','9876543302',NULL,1,'user','2026-05-11 15:00:42','2026-05-11 15:00:42',NULL,NULL),(11,'Rohit Sharma','rohit@example.com','$2a$10$example.hash.here','9876543303',NULL,1,'user','2026-05-11 15:00:42','2026-05-11 15:00:42',NULL,NULL),(12,'Kavya Reddy','kavya@example.com','$2a$10$example.hash.here','9876543304',NULL,1,'user','2026-05-11 15:00:42','2026-05-11 15:00:42',NULL,NULL),(13,'Deepak Kumar','deepak@example.com','$2a$10$example.hash.here','9876543305',NULL,1,'user','2026-05-11 15:00:42','2026-05-11 15:00:42',NULL,NULL),(14,'Sample Seller','seller@example.com','hashedpassword','9876543210',NULL,1,'user','2026-05-11 16:07:01','2026-05-11 16:07:01',NULL,NULL),(15,'Materials Vendor','materials@vendor.com','$2b$10$mLZQVEm/Wx/Dn6pt6NReluW6UdUBnXVAQu1QGsxyev43V3.2B3l/2','9876543210',NULL,1,'user','2026-05-14 14:18:19','2026-05-20 15:02:21',NULL,NULL),(16,'Test Owner','testowner@example.com','$2b$10$xWIt7b9jUT1993SVq4mZr.R7v2SZ1dJ5uVV5vmoh.jgr3P5fJm7xy','9876543210',NULL,1,'user','2026-05-14 14:47:38','2026-05-14 14:47:38',NULL,NULL),(17,'Test Buyer','testbuyer@example.com','$2b$10$2lOSx6sL/hEBGACU8rS/heEyxg6ViBj.UDsnY9fDJy6/iptY9/gLG','9876543211',NULL,0,'user','2026-05-14 14:47:38','2026-05-14 14:47:38',NULL,NULL),(18,'Property Owner','owner@test.com','$2b$10$j.Yacjak/R46mwgvTRgVl.790OaMoP08Lvr6AyaZejL8Hf4W8RS1.','9876543210',NULL,1,'user','2026-05-14 14:50:50','2026-05-14 14:50:50',NULL,NULL),(19,'Listing Creator','listingcreator@test.com','$2b$10$DwXoEPTlrOIwOCn4DJIuEeur95XRzw6BP4UMn2LpmD0K2afB.SWu2','9876543210',NULL,1,'user','2026-05-14 15:02:44','2026-05-14 15:02:44',NULL,NULL),(20,'Demo Property Owner','demo.owner@example.com','$2b$10$vULN0RT0l0CJ3AggJ584aulFhKKbgEEfi2BL.rJZB6qgcD8C03Vva','9876543210',NULL,1,'user','2026-05-14 15:27:28','2026-05-14 16:10:47',NULL,NULL),(21,'John Buyer','john.buyer@example.com','$2b$10$uT6Qp.KA0iDNUhucW0/8rewo9j.i8kUMRqN6YXw2bIkPlzh9ISsrq','9876543211',NULL,0,'user','2026-05-14 15:27:28','2026-05-14 15:27:28',NULL,NULL),(22,'Sarah Customer','sarah.customer@example.com','$2b$10$bdct8z9sa7NYR2nkq84uUe7TZN3KKWJLLkuyN3.nHxULI03DgAiUu','9876543212',NULL,0,'user','2026-05-14 15:27:29','2026-05-14 15:27:29',NULL,NULL),(23,'Mike Tenant','mike.tenant@example.com','$2b$10$Hb/loZy6PzuwbrKjH1a1wenfN9DrMa21kkVLRhXXcZe7KPDCjWIoW','9876543213',NULL,0,'user','2026-05-14 15:27:29','2026-05-14 15:27:29',NULL,NULL),(24,'Amit Patel','amit@example.com','$2b$10$jkPA21dmXqFlDaNBDuj6f.FqhAc/HkebWxiBBZQ7c3/AtAb6cbvd2','9876543212',NULL,0,'user','2026-05-15 01:52:06','2026-05-15 01:52:06',NULL,NULL),(25,'Siva Kumar','sivakumar@gmail.com','$2b$10$qUjUQGaX1TI2TPny0k12oOM82QHkkCOKQxaxQ35P.q1rqMcHIvdUy','9876543210',NULL,0,'user','2026-05-15 02:11:19','2026-05-15 02:11:19',NULL,NULL),(26,'Rajesh Sharma','rajeshsharma@gmail.com','$2b$10$zGA.CfbLs7ONCeLGt2UmtuA7wf8ke0Vlyk47iNgchKeSGTtF5F3o2','9876543211',NULL,0,'user','2026-05-15 02:11:19','2026-05-15 02:11:19',NULL,NULL),(27,'Priya Reddy','priyareddy@gmail.com','$2b$10$1BJOFQpos7YRUsvo3cnJJeRemmwYXGaR/RSKV3zNYK17Cg6/Z4rxC','9876543213',NULL,0,'user','2026-05-15 02:11:19','2026-05-15 02:11:19',NULL,NULL),(28,'Vikram Patel','vikrampatel@gmail.com','$2b$10$6g79OB2ykQRNJEA06RhyMuX/VS017JxuX.eZFT/faBVYIEZLlBew2','9876543214',NULL,0,'user','2026-05-15 02:11:19','2026-05-15 02:11:19',NULL,NULL),(29,'Anita Desai','anitadesai@gmail.com','$2b$10$Xg2z6QdxU5rhHuMCmtTLHeQe18ccwgnqRvaAOYcRXJ.3QRyqes206','9876543215',NULL,0,'user','2026-05-15 02:11:19','2026-05-15 02:11:19',NULL,NULL),(30,'Furniture Store Owner','furniturestore@gmail.com','$2b$10$j0U72p.Ehnl0yLQsoEqjneAFHHP/KcdNoJuIIyJuTF3n.GI9GYg7y','9876543216',NULL,0,'user','2026-05-15 02:11:19','2026-05-15 02:11:19',NULL,NULL),(31,'Property Developer','propertydeveloper@gmail.com','$2b$10$MScbS1smvS0BJg6LF5hMluXRAwFyEaxSRZkBfy/Q9NGWCZXw6KSfq','9876543217',NULL,0,'user','2026-05-15 02:11:20','2026-05-15 02:11:20',NULL,NULL),(32,'Demo Owner','demoowner@gmail.com','$2b$10$1LvCoZulP2pvKAvMtf0zQuVNcCMzANccowdRjQVgDEGdxFzLQYB/O','9876543210',NULL,0,'user','2026-05-15 02:13:50','2026-05-15 02:13:50',NULL,NULL),(34,'Prabhavathi','komitireddyprabhavathi2@gmail.com','$2b$10$mLZQVEm/Wx/Dn6pt6NReluW6UdUBnXVAQu1QGsxyev43V3.2B3l/2','7095792399',NULL,1,'user','2026-05-16 03:15:44','2026-05-20 15:02:21',NULL,NULL),(36,'Likhitha','likhithagollapalli11@gmail.com','$2b$10$mLZQVEm/Wx/Dn6pt6NReluW6UdUBnXVAQu1QGsxyev43V3.2B3l/2','9182314067',NULL,1,'user','2026-05-16 03:43:30','2026-05-20 15:02:21',NULL,NULL),(40,'John Doe','john.doe@example.com','$2b$10$Jc115VDmsqslGXdzb0Jx2O53aKGKs0ghfVZtpF8Lrq4bE9aieCOOC','9876543210',NULL,0,'user','2026-05-16 04:46:30','2026-05-16 04:46:30','6bf1ae5f59086c81d607dfff15a7924086d30e4b7bb45207cc9ccebb61790b95','2026-05-18 04:46:30'),(41,'a','prabhavathikommitreda@gmail.com','$2b$10$t1b51HizPsbeYQ/YkTG8f.rbf1DewloMDcpmxYk0oV./4kOkt2Cu.','1234567890',NULL,0,'user','2026-05-16 05:34:37','2026-05-16 05:34:37','3fa793364d21c22e61e7ee9730089e51c4996b8560d3083afa216924a1df4ccb','2026-05-18 05:34:36'),(42,'kavya','99220040577@klu.ac.in','$2b$10$i4NuddbSugLo.H8GhA5OZuUxf8d2ubK7GO8pBROKyfhRjgcCXaFn6','8367060462',NULL,1,'user','2026-05-16 05:35:59','2026-05-16 05:36:59',NULL,NULL),(43,'Vamsi','99220040141@klu.ac.in','$2b$10$Hd34LB/Q77d3QfpzmFT1SOw7kgYl/uSSLSkdDF5IIGtLCvFZe0wxG','8497967020',NULL,0,'user','2026-05-20 14:19:31','2026-05-20 14:19:31',NULL,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vendors`
--

DROP TABLE IF EXISTS `vendors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vendors` (
  `id` int NOT NULL AUTO_INCREMENT,
  `businessName` varchar(255) NOT NULL,
  `contactPerson` varchar(255) NOT NULL,
  `contactPhone` varchar(255) NOT NULL,
  `contactEmail` varchar(255) NOT NULL,
  `whatsappNumber` varchar(255) DEFAULT NULL,
  `businessAddress` text,
  `vendorType` enum('building_materials','home_services') NOT NULL,
  `categories` json DEFAULT NULL,
  `description` text,
  `experience` varchar(255) DEFAULT NULL,
  `serviceArea` varchar(255) DEFAULT NULL,
  `city` varchar(255) NOT NULL,
  `state` varchar(255) DEFAULT NULL,
  `pincode` varchar(255) DEFAULT NULL,
  `minPrice` decimal(15,2) DEFAULT NULL,
  `maxPrice` decimal(15,2) DEFAULT NULL,
  `priceType` enum('hourly','project_based','per_unit','per_kg','per_sqft','fixed') DEFAULT 'project_based',
  `certifications` text,
  `languages` varchar(255) DEFAULT NULL,
  `availability` varchar(255) DEFAULT NULL,
  `images` json DEFAULT NULL,
  `documents` json DEFAULT NULL,
  `isVerified` tinyint(1) DEFAULT '0',
  `isActive` tinyint(1) DEFAULT '1',
  `isFeatured` tinyint(1) DEFAULT '0',
  `adminNotes` text,
  `verifiedAt` datetime DEFAULT NULL,
  `verifiedBy` int DEFAULT NULL,
  `userId` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `locality` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `vendors_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `vendors_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vendors`
--

LOCK TABLES `vendors` WRITE;
/*!40000 ALTER TABLE `vendors` DISABLE KEYS */;
INSERT INTO `vendors` VALUES (1,'Premium Building Materials','Materials Vendor','9876543210','materials@vendor.com','9876543210','123 Whitefield, Bangalore','building_materials','[\"Cement\", \"Steel\", \"Bricks\", \"Sand\", \"Aggregates\"]','Quality building materials supplier for construction projects','5+ years','Bangalore','Bangalore','State','560001',500.00,25000.00,'per_unit','Licensed and Insured','English, Hindi','Mon-Sat 9AM-7PM','[]','[]',0,1,0,NULL,NULL,NULL,15,'2026-05-14 14:18:19','2026-05-14 14:18:19','Whitefield'),(4,'Prabhavtahi Services','Prabhavathi','7095792399','komitireddyprabhavathi2@gmail.com',NULL,'Naiduvaripalli','home_services','[\"Plumbing\", \"Electrical\", \"Interior Design\", \"AC Repair\"]',NULL,NULL,NULL,'Hyderabad',NULL,NULL,NULL,NULL,'project_based',NULL,NULL,NULL,'[]','[]',1,1,1,NULL,'2026-05-16 03:15:44',NULL,34,'2026-05-16 03:15:44','2026-05-16 03:15:44','KPHB '),(6,'Likhitha Bussiness','Likhitha','9182314067','likhithagollapalli11@gmail.com',NULL,NULL,'building_materials','[\"Cement\", \"Wood\"]',NULL,NULL,NULL,'Chennai',NULL,NULL,NULL,NULL,'project_based',NULL,NULL,NULL,'[]','[]',0,1,0,NULL,'2026-05-16 03:43:30',NULL,36,'2026-05-16 03:43:30','2026-05-16 03:43:30','beach');
/*!40000 ALTER TABLE `vendors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `visit_bookings`
--

DROP TABLE IF EXISTS `visit_bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `visit_bookings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `listingId` int NOT NULL,
  `visitDate` date NOT NULL,
  `timeSlot` varchar(255) NOT NULL,
  `specificTime` varchar(255) DEFAULT NULL,
  `status` enum('pending','confirmed','completed','cancelled') DEFAULT 'pending',
  `userPhone` varchar(255) DEFAULT NULL,
  `userEmail` varchar(255) DEFAULT NULL,
  `notes` text,
  `adminNotes` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  KEY `listingId` (`listingId`),
  CONSTRAINT `visit_bookings_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`),
  CONSTRAINT `visit_bookings_ibfk_2` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `visit_bookings`
--

LOCK TABLES `visit_bookings` WRITE;
/*!40000 ALTER TABLE `visit_bookings` DISABLE KEYS */;
INSERT INTO `visit_bookings` VALUES (3,3,2,'2026-04-26','Evening','04:30 PM','completed','','gollapallilikki@gmail.com','Visit scheduled for Siva House',NULL,'2026-04-26 05:32:12','2026-04-27 14:52:44'),(4,3,2,'2026-04-27','Evening','05:00 PM','completed','','gollapallilikki@gmail.com','Visit scheduled for Siva House',NULL,'2026-04-26 05:45:49','2026-04-26 05:50:54'),(5,3,2,'2026-04-29','Afternoon','01:00 PM','confirmed','','gollapallilikki@gmail.com','Visit scheduled for Siva House',NULL,'2026-04-26 05:49:28','2026-04-26 05:50:51'),(7,3,2,'2026-05-01','Night','07:00 PM','confirmed','','gollapallilikki@gmail.com','Visit scheduled for Siva House',NULL,'2026-04-26 05:57:29','2026-04-26 05:57:48'),(9,3,2,'2026-04-28','Afternoon','01:00 PM','completed','','gollapallilikki@gmail.com','Visit scheduled for Siva House',NULL,'2026-04-27 13:07:06','2026-04-27 14:54:40');
/*!40000 ALTER TABLE `visit_bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wishlists`
--

DROP TABLE IF EXISTS `wishlists`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wishlists` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `listingId` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  KEY `listingId` (`listingId`),
  CONSTRAINT `wishlists_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `wishlists_ibfk_10` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `wishlists_ibfk_100` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `wishlists_ibfk_101` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `wishlists_ibfk_102` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `wishlists_ibfk_103` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `wishlists_ibfk_104` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `wishlists_ibfk_105` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `wishlists_ibfk_11` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `wishlists_ibfk_12` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `wishlists_ibfk_13` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `wishlists_ibfk_14` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `wishlists_ibfk_15` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `wishlists_ibfk_16` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `wishlists_ibfk_17` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `wishlists_ibfk_18` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `wishlists_ibfk_19` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `wishlists_ibfk_2` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `wishlists_ibfk_20` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `wishlists_ibfk_21` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `wishlists_ibfk_22` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `wishlists_ibfk_23` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `wishlists_ibfk_24` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `wishlists_ibfk_25` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `wishlists_ibfk_26` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `wishlists_ibfk_27` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `wishlists_ibfk_28` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `wishlists_ibfk_29` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `wishlists_ibfk_3` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `wishlists_ibfk_30` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `wishlists_ibfk_31` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `wishlists_ibfk_32` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `wishlists_ibfk_33` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `wishlists_ibfk_34` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `wishlists_ibfk_35` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `wishlists_ibfk_36` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `wishlists_ibfk_37` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `wishlists_ibfk_38` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `wishlists_ibfk_39` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `wishlists_ibfk_4` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `wishlists_ibfk_40` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `wishlists_ibfk_41` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `wishlists_ibfk_42` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `wishlists_ibfk_43` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `wishlists_ibfk_44` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `wishlists_ibfk_45` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `wishlists_ibfk_46` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `wishlists_ibfk_47` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `wishlists_ibfk_48` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `wishlists_ibfk_49` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `wishlists_ibfk_5` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `wishlists_ibfk_50` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `wishlists_ibfk_51` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `wishlists_ibfk_52` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `wishlists_ibfk_53` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `wishlists_ibfk_54` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `wishlists_ibfk_55` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `wishlists_ibfk_56` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `wishlists_ibfk_57` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `wishlists_ibfk_58` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `wishlists_ibfk_59` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `wishlists_ibfk_6` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `wishlists_ibfk_60` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `wishlists_ibfk_61` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `wishlists_ibfk_62` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `wishlists_ibfk_63` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `wishlists_ibfk_64` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `wishlists_ibfk_65` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `wishlists_ibfk_66` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `wishlists_ibfk_67` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `wishlists_ibfk_68` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `wishlists_ibfk_69` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `wishlists_ibfk_7` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `wishlists_ibfk_70` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `wishlists_ibfk_71` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `wishlists_ibfk_72` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `wishlists_ibfk_73` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `wishlists_ibfk_74` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `wishlists_ibfk_75` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `wishlists_ibfk_76` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `wishlists_ibfk_77` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `wishlists_ibfk_78` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `wishlists_ibfk_79` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `wishlists_ibfk_8` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `wishlists_ibfk_80` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `wishlists_ibfk_81` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `wishlists_ibfk_82` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `wishlists_ibfk_83` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `wishlists_ibfk_84` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `wishlists_ibfk_85` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `wishlists_ibfk_86` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `wishlists_ibfk_87` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `wishlists_ibfk_88` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `wishlists_ibfk_89` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `wishlists_ibfk_9` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `wishlists_ibfk_90` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `wishlists_ibfk_91` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `wishlists_ibfk_92` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `wishlists_ibfk_93` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `wishlists_ibfk_94` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `wishlists_ibfk_95` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `wishlists_ibfk_96` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `wishlists_ibfk_97` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `wishlists_ibfk_98` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `wishlists_ibfk_99` FOREIGN KEY (`listingId`) REFERENCES `listings` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wishlists`
--

LOCK TABLES `wishlists` WRITE;
/*!40000 ALTER TABLE `wishlists` DISABLE KEYS */;
/*!40000 ALTER TABLE `wishlists` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-08-18  6:40:41
