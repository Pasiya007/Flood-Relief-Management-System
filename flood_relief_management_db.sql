-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 18, 2026 at 08:33 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `flood_relief_management_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `login`
--

CREATE TABLE `login` (
  `NIC` char(20) NOT NULL,
  `password` varchar(20) NOT NULL,
  `userName` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `login`
--

INSERT INTO `login` (`NIC`, `password`, `userName`) VALUES
('0987654321', 'qwerty', 'kamal'),
('1010101010', 'asdfgh', 'Ranil wickramasinghe'),
('1234567894', 'asdfgh', 'Nimal'),
('200414000361', 'zxcvbn', 'Pasindu'),
('4040404040', 'asdfgh', 'Sanath Nishantha'),
('5678901234', 'asdfgh', 'ranil');

-- --------------------------------------------------------

--
-- Table structure for table `relief_request`
--

CREATE TABLE `relief_request` (
  `relief_ID` int(20) NOT NULL,
  `NIC` char(20) NOT NULL,
  `relief_type` varchar(10) NOT NULL,
  `district` varchar(20) NOT NULL,
  `GN_division` varchar(20) NOT NULL,
  `contact_name` varchar(30) NOT NULL,
  `contact_number` varchar(15) NOT NULL,
  `address` varchar(50) NOT NULL,
  `no_familly_mem` int(20) NOT NULL,
  `security_level` varchar(10) NOT NULL,
  `description` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `relief_request`
--

INSERT INTO `relief_request` (`relief_ID`, `NIC`, `relief_type`, `district`, `GN_division`, `contact_name`, `contact_number`, `address`, `no_familly_mem`, `security_level`, `description`) VALUES
(4, '1234567894', 'Water', 'Colombo', 'ertsrgas', 'Pasindu Manoj', '7654324567', 'asdfghjklkjhgfd', 6, 'High', 'poiuytrewqasdfghjkl,mnbvcx'),
(5, '1234567894', 'Medicine', 'Gampaha', 'Mawathgama', 'asadsd', '65434567', 'asdfghjklkjhgfd', 3, 'High', 'efwgdbfgnf'),
(6, '200414000361', 'Shelter', 'Ampara', 'Mawathgama', 'Pasindu Manoj', '7654324567', 'asdfghjklkjhgfd', 3, 'Medium', 'qwewerrtrgfgfgeg');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `login`
--
ALTER TABLE `login`
  ADD PRIMARY KEY (`NIC`);

--
-- Indexes for table `relief_request`
--
ALTER TABLE `relief_request`
  ADD PRIMARY KEY (`relief_ID`),
  ADD KEY `fk_user_login` (`NIC`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `relief_request`
--
ALTER TABLE `relief_request`
  MODIFY `relief_ID` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `relief_request`
--
ALTER TABLE `relief_request`
  ADD CONSTRAINT `fk_user_login` FOREIGN KEY (`NIC`) REFERENCES `login` (`NIC`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
