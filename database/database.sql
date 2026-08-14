-- ============================================
-- Flight Ticket Management System - Database
-- Single-file setup with all mock data
-- ============================================

DROP DATABASE IF EXISTS flight_ticket_db;
CREATE DATABASE flight_ticket_db;
USE flight_ticket_db;

-- ============================================
-- TABLES
-- ============================================

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(15),
  role ENUM('passenger','admin') DEFAULT 'passenger',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE airports (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(10) UNIQUE NOT NULL,
  name VARCHAR(150) NOT NULL,
  city VARCHAR(100) NOT NULL,
  country VARCHAR(100) NOT NULL
);

CREATE TABLE flights (
  id INT AUTO_INCREMENT PRIMARY KEY,
  flight_number VARCHAR(20) UNIQUE NOT NULL,
  airline VARCHAR(100) NOT NULL,
  source_airport_id INT NOT NULL,
  destination_airport_id INT NOT NULL,
  departure_time DATETIME NOT NULL,
  arrival_time DATETIME NOT NULL,
  duration VARCHAR(20),
  price DECIMAL(10,2) NOT NULL,
  total_seats INT NOT NULL DEFAULT 60,
  available_seats INT NOT NULL DEFAULT 60,
  status ENUM('active','cancelled') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (source_airport_id) REFERENCES airports(id),
  FOREIGN KEY (destination_airport_id) REFERENCES airports(id)
);

CREATE TABLE seats (
  id INT AUTO_INCREMENT PRIMARY KEY,
  flight_id INT NOT NULL,
  seat_number VARCHAR(5) NOT NULL,
  seat_class ENUM('economy','business') DEFAULT 'economy',
  is_available BOOLEAN DEFAULT TRUE,
  booking_id INT DEFAULT NULL,
  FOREIGN KEY (flight_id) REFERENCES flights(id) ON DELETE CASCADE,
  UNIQUE KEY unique_seat (flight_id, seat_number)
);

CREATE TABLE bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pnr VARCHAR(20) UNIQUE NOT NULL,
  user_id INT NOT NULL,
  flight_id INT NOT NULL,
  seat_id INT,
  journey_date DATE NOT NULL,
  status ENUM('confirmed','cancelled','pending') DEFAULT 'pending',
  total_amount DECIMAL(10,2) NOT NULL,
  booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (flight_id) REFERENCES flights(id) ON DELETE CASCADE,
  FOREIGN KEY (seat_id) REFERENCES seats(id) ON DELETE SET NULL
);

CREATE TABLE passengers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  booking_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  age INT NOT NULL,
  gender ENUM('Male','Female','Other') NOT NULL,
  email VARCHAR(100),
  phone VARCHAR(15),
  FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
);

CREATE TABLE payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  booking_id INT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  transaction_id VARCHAR(100),
  status ENUM('success','failed','pending') DEFAULT 'pending',
  payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
);

-- ============================================
-- MOCK USERS
-- Passwords are bcrypt hashed (cost=10):
--   admin123, john123, priya123, rahul123, sneha123, amit123
-- ============================================
-- These hashes are pre-generated and verified to work.
-- If you ever want to regenerate, run: node database/seed.js
INSERT INTO users (name, email, password, phone, role) VALUES
('Admin User',   'admin@flight.com',  '$2a$10$ttt6A2TO6..KyfMSJNh7aeeYyTGhQPIMiGUqXStKeS7J177TwJ2Eq', '9876543210', 'admin'),
('John Smith',   'john@example.com',  '$2a$10$Dlz.YjQPwuDfj5OfHS5lw.VdN1mqg2Kr6bTiTvkFytL5SKgv7w10.', '9876543211', 'passenger'),
('Priya Sharma', 'priya@example.com', '$2a$10$SvOTwF7mXf/.rGrGnTWci.cAgJenUNCwvqAYkaWdLONESVA84oCr.', '9876543212', 'passenger'),
('Rahul Verma',  'rahul@example.com', '$2a$10$Pj9f8OGi4vIAPLoZokK6nugkNEC8sIe5aZJoJ2nwLBWcpC2iJQ7s6', '9876543213', 'passenger'),
('Sneha Patel',  'sneha@example.com', '$2a$10$2/Kuh13WvrNHKZXqcFwr1OOoJ3RJ4ytXCeuyoIdoDVEHDOvRwiBMm5', '9876543214', 'passenger'),
('Amit Kumar',   'amit@example.com',  '$2a$10$G0cmraoXR.a.zDT3tOaKuuvWTt.O2r2tGuGHvKOLM1QMKQQiwJK/O', '9876543215', 'passenger');

-- ============================================
-- MOCK AIRPORTS (10)
-- ============================================
INSERT INTO airports (code, name, city, country) VALUES
('DEL', 'Indira Gandhi International Airport',          'New Delhi',  'India'),
('BOM', 'Chhatrapati Shivaji Maharaj Intl. Airport',   'Mumbai',     'India'),
('BLR', 'Kempegowda International Airport',            'Bangalore',  'India'),
('MAA', 'Chennai International Airport',               'Chennai',    'India'),
('CCU', 'Netaji Subhas Chandra Bose Intl. Airport',    'Kolkata',    'India'),
('HYD', 'Rajiv Gandhi International Airport',          'Hyderabad',  'India'),
('GOI', 'Goa International Airport',                   'Goa',        'India'),
('PNQ', 'Pune Airport',                                'Pune',       'India'),
('JAI', 'Jaipur International Airport',                'Jaipur',     'India'),
('LKO', 'Chaudhary Charan Singh Airport',              'Lucknow',    'India');

-- ============================================
-- MOCK FLIGHTS — 40 flights, all from Aug 15, 2026
-- Airport IDs: 1=DEL, 2=BOM, 3=BLR, 4=MAA, 5=CCU, 6=HYD, 7=GOI, 8=PNQ, 9=JAI, 10=LKO
-- ============================================
INSERT INTO flights (flight_number, airline, source_airport_id, destination_airport_id, departure_time, arrival_time, duration, price, total_seats, available_seats) VALUES
-- ============ AUGUST 2026 ============
('AI101', 'Air India',  1, 2, '2026-08-15 08:00:00', '2026-08-15 10:30:00', '2h 30m', 4500.00, 60, 60),
('AI102', 'Air India',  2, 1, '2026-08-15 12:00:00', '2026-08-15 14:30:00', '2h 30m', 4500.00, 60, 60),
('6E201', 'IndiGo',     1, 2, '2026-08-15 14:00:00', '2026-08-15 16:30:00', '2h 30m', 4200.00, 60, 60),
('6E202', 'IndiGo',     2, 1, '2026-08-15 18:00:00', '2026-08-15 20:30:00', '2h 30m', 4200.00, 60, 60),
('UK201', 'Vistara',    1, 2, '2026-08-16 07:00:00', '2026-08-16 09:30:00', '2h 30m', 5200.00, 60, 60),

('6E203', 'IndiGo',     1, 3, '2026-08-15 09:30:00', '2026-08-15 12:15:00', '2h 45m', 3800.00, 60, 60),
('6E204', 'IndiGo',     3, 1, '2026-08-15 14:00:00', '2026-08-15 16:45:00', '2h 45m', 3800.00, 60, 60),
('UK301', 'Vistara',    1, 3, '2026-08-15 18:00:00', '2026-08-15 20:45:00', '2h 45m', 5200.00, 60, 60),
('AI301', 'Air India',  3, 1, '2026-08-16 06:00:00', '2026-08-16 08:45:00', '2h 45m', 4000.00, 60, 60),

('UK302', 'Vistara',    2, 4, '2026-08-15 07:00:00', '2026-08-15 09:00:00', '2h 00m', 4200.00, 60, 60),
('SG401', 'SpiceJet',   2, 4, '2026-08-15 13:00:00', '2026-08-15 15:00:00', '2h 00m', 3800.00, 60, 60),
('6E205', 'IndiGo',     4, 2, '2026-08-16 10:00:00', '2026-08-16 12:00:00', '2h 00m', 3900.00, 60, 60),

('SG402', 'SpiceJet',   1, 5, '2026-08-15 11:00:00', '2026-08-15 13:30:00', '2h 30m', 4100.00, 60, 60),
('AI103', 'Air India',  5, 1, '2026-08-15 16:00:00', '2026-08-15 18:30:00', '2h 30m', 4100.00, 60, 60),
('6E206', 'IndiGo',     1, 5, '2026-08-16 05:00:00', '2026-08-16 07:30:00', '2h 30m', 4000.00, 60, 60),

('AI104', 'Air India',  1, 6, '2026-08-15 15:00:00', '2026-08-15 17:00:00', '2h 00m', 4000.00, 60, 60),
('6E207', 'IndiGo',     6, 1, '2026-08-15 19:00:00', '2026-08-15 21:00:00', '2h 00m', 4000.00, 60, 60),
('UK303', 'Vistara',    1, 6, '2026-08-16 08:00:00', '2026-08-16 10:00:00', '2h 00m', 4500.00, 60, 60),

('6E208', 'IndiGo',     2, 7, '2026-08-15 10:00:00', '2026-08-15 11:15:00', '1h 15m', 2500.00, 60, 60),
('AI105', 'Air India',  7, 2, '2026-08-15 17:00:00', '2026-08-15 18:15:00', '1h 15m', 2500.00, 60, 60),
('SG403', 'SpiceJet',   2, 7, '2026-08-16 12:00:00', '2026-08-16 13:15:00', '1h 15m', 2200.00, 60, 60),

('AI106', 'Air India',  2, 8, '2026-08-15 09:00:00', '2026-08-15 10:00:00', '1h 00m', 2200.00, 60, 60),
('SG404', 'SpiceJet',   8, 2, '2026-08-15 18:00:00', '2026-08-15 19:00:00', '1h 00m', 2200.00, 60, 60),

('6E209', 'IndiGo',     1, 7, '2026-08-15 06:00:00', '2026-08-15 08:30:00', '2h 30m', 4800.00, 60, 60),
('UK304', 'Vistara',    7, 1, '2026-08-15 19:00:00', '2026-08-15 21:30:00', '2h 30m', 4800.00, 60, 60),

('AI201', 'Air India',  1, 9, '2026-08-15 10:00:00', '2026-08-15 11:00:00', '1h 00m', 2800.00, 60, 60),
('6E210', 'IndiGo',     9, 1, '2026-08-15 20:00:00', '2026-08-15 21:00:00', '1h 00m', 2800.00, 60, 60),

('SG405', 'SpiceJet',   1, 10, '2026-08-15 13:00:00', '2026-08-15 14:15:00', '1h 15m', 3000.00, 60, 60),
('UK305', 'Vistara',    10, 1, '2026-08-15 17:00:00', '2026-08-15 18:15:00', '1h 15m', 3200.00, 60, 60),

('AI401', 'Air India',  2, 3, '2026-08-16 11:00:00', '2026-08-16 13:00:00', '2h 00m', 3500.00, 60, 60),
('6E211', 'IndiGo',     3, 2, '2026-08-16 16:00:00', '2026-08-16 18:00:00', '2h 00m', 3500.00, 60, 60),

('UK306', 'Vistara',    3, 6, '2026-08-16 08:00:00', '2026-08-16 09:15:00', '1h 15m', 2800.00, 60, 60),
('6E212', 'IndiGo',     6, 3, '2026-08-16 20:00:00', '2026-08-16 21:15:00', '1h 15m', 2800.00, 60, 60),

-- ============ SEPTEMBER 2026 ============
('AI501', 'Air India',  1, 2, '2026-09-10 08:00:00', '2026-09-10 10:30:00', '2h 30m', 4300.00, 60, 60),
('6E301', 'IndiGo',     2, 3, '2026-09-10 09:00:00', '2026-09-10 11:00:00', '2h 00m', 3700.00, 60, 60),
('UK401', 'Vistara',    1, 4, '2026-09-10 14:00:00', '2026-09-10 16:15:00', '2h 15m', 4600.00, 60, 60),
('SG501', 'SpiceJet',   3, 5, '2026-09-10 11:00:00', '2026-09-10 13:30:00', '2h 30m', 3900.00, 60, 60),

-- ============ OCTOBER 2026 (festive season) ============
('AI601', 'Air India',  1, 2, '2026-10-02 07:00:00', '2026-10-02 09:30:00', '2h 30m', 5800.00, 60, 60),
('6E401', 'IndiGo',     1, 3, '2026-10-02 10:00:00', '2026-10-02 12:45:00', '2h 45m', 4900.00, 60, 60),
('UK501', 'Vistara',    2, 7, '2026-10-02 13:00:00', '2026-10-02 14:15:00', '1h 15m', 3500.00, 60, 60),
('SG601', 'SpiceJet',   1, 5, '2026-10-02 16:00:00', '2026-10-02 18:30:00', '2h 30m', 4500.00, 60, 60),

-- ============ NOVEMBER 2026 ============
('AI701', 'Air India',  1, 2, '2026-11-15 08:00:00', '2026-11-15 10:30:00', '2h 30m', 4700.00, 60, 60),
('6E501', 'IndiGo',     2, 3, '2026-11-15 12:00:00', '2026-11-15 14:00:00', '2h 00m', 3900.00, 60, 60),

-- ============ DECEMBER 2026 (year-end) ============
('AI801', 'Air India',  1, 2, '2026-12-20 08:00:00', '2026-12-20 10:30:00', '2h 30m', 6200.00, 60, 60),
('UK601', 'Vistara',    2, 7, '2026-12-20 11:00:00', '2026-12-20 12:15:00', '1h 15m', 3800.00, 60, 60),
('6E601', 'IndiGo',     1, 3, '2026-12-20 14:00:00', '2026-12-20 16:45:00', '2h 45m', 5100.00, 60, 60);

-- ============================================
-- MOCK SEATS — 60 seats per flight (auto-generated)
-- Layout: 10 rows × 6 cols (A,B,C,D,E,F)
-- Uses MySQL 8.0+ recursive CTE
-- ============================================
INSERT INTO seats (flight_id, seat_number, seat_class, is_available, booking_id)
WITH RECURSIVE num(n) AS (
  SELECT 1 UNION ALL SELECT n + 1 FROM num WHERE n < 60
)
SELECT
  f.id,
  CONCAT(FLOOR((n-1)/6) + 1, ELT(((n-1) % 6) + 1, 'A','B','C','D','E','F')) AS seat_number,
  'economy',
  TRUE,
  NULL
FROM flights f
CROSS JOIN num;

-- ============================================
-- MOCK BOOKINGS — 10 sample bookings
-- Users: 2=John, 3=Priya, 4=Rahul, 5=Sneha, 6=Amit
-- ============================================
INSERT INTO bookings (pnr, user_id, flight_id, seat_id, journey_date, status, total_amount, booking_date) VALUES
('FTM-A1B2C3', 2, 1,  NULL, '2026-08-15', 'confirmed',  4500.00, '2026-08-01 10:30:00'),
('FTM-D4E5F6', 3, 2,  NULL, '2026-08-15', 'confirmed',  4500.00, '2026-08-02 14:15:00'),
('FTM-G7H8I9', 4, 10, NULL, '2026-08-15', 'confirmed',  4200.00, '2026-08-03 09:45:00'),
('FTM-J1K2L3', 5, 17, NULL, '2026-08-15', 'pending',    4000.00, '2026-08-04 16:20:00'),
('FTM-M4N5O6', 6, 25, NULL, '2026-08-15', 'confirmed',  2800.00, '2026-08-05 11:00:00'),
('FTM-P7Q8R9', 2, 13, NULL, '2026-08-15', 'cancelled',  4100.00, '2026-08-06 08:30:00'),
('FTM-S1T2U3', 3, 19, NULL, '2026-08-15', 'confirmed',  4000.00, '2026-08-07 13:45:00'),
('FTM-V4W5X6', 4, 21, NULL, '2026-08-15', 'confirmed',  2500.00, '2026-08-08 19:10:00'),
('FTM-Y7Z8A9', 5, 28, NULL, '2026-08-15', 'pending',    3000.00, '2026-08-09 07:25:00'),
('FTM-B1C2D3', 6, 9,  NULL, '2026-08-16', 'confirmed',  3800.00, '2026-08-10 15:50:00');

-- ============================================
-- LINK BOOKINGS TO SPECIFIC SEATS + MARK UNAVAILABLE
-- This avoids relying on auto-increment order
-- ============================================
UPDATE bookings b JOIN seats s ON s.flight_id = b.flight_id AND s.seat_number = '2B'
SET b.seat_id = s.id, s.is_available = FALSE, s.booking_id = b.id
WHERE b.pnr = 'FTM-A1B2C3';

UPDATE bookings b JOIN seats s ON s.flight_id = b.flight_id AND s.seat_number = '1B'
SET b.seat_id = s.id, s.is_available = FALSE, s.booking_id = b.id
WHERE b.pnr = 'FTM-D4E5F6';

UPDATE bookings b JOIN seats s ON s.flight_id = b.flight_id AND s.seat_number = '2A'
SET b.seat_id = s.id, s.is_available = FALSE, s.booking_id = b.id
WHERE b.pnr = 'FTM-G7H8I9';

UPDATE bookings b JOIN seats s ON s.flight_id = b.flight_id AND s.seat_number = '1B'
SET b.seat_id = s.id, s.is_available = FALSE, s.booking_id = b.id
WHERE b.pnr = 'FTM-J1K2L3';

UPDATE bookings b JOIN seats s ON s.flight_id = b.flight_id AND s.seat_number = '3A'
SET b.seat_id = s.id, s.is_available = FALSE, s.booking_id = b.id
WHERE b.pnr = 'FTM-M4N5O6';

UPDATE bookings b JOIN seats s ON s.flight_id = b.flight_id AND s.seat_number = '1C'
SET b.seat_id = s.id, s.is_available = FALSE, s.booking_id = b.id
WHERE b.pnr = 'FTM-S1T2U3';

UPDATE bookings b JOIN seats s ON s.flight_id = b.flight_id AND s.seat_number = '2A'
SET b.seat_id = s.id, s.is_available = FALSE, s.booking_id = b.id
WHERE b.pnr = 'FTM-V4W5X6';

UPDATE bookings b JOIN seats s ON s.flight_id = b.flight_id AND s.seat_number = '1A'
SET b.seat_id = s.id, s.is_available = FALSE, s.booking_id = b.id
WHERE b.pnr = 'FTM-Y7Z8A9';

UPDATE bookings b JOIN seats s ON s.flight_id = b.flight_id AND s.seat_number = '1B'
SET b.seat_id = s.id, s.is_available = FALSE, s.booking_id = b.id
WHERE b.pnr = 'FTM-B1C2D3';

-- ============================================
-- MOCK PASSENGERS
-- ============================================
INSERT INTO passengers (booking_id, name, age, gender, email, phone) VALUES
(1,  'John Smith',   32, 'Male',   'john@example.com',  '9876543211'),
(2,  'Priya Sharma', 28, 'Female', 'priya@example.com', '9876543212'),
(3,  'Rahul Verma',  35, 'Male',   'rahul@example.com', '9876543213'),
(4,  'Sneha Patel',  26, 'Female', 'sneha@example.com', '9876543214'),
(5,  'Amit Kumar',   41, 'Male',   'amit@example.com',  '9876543215'),
(6,  'John Smith',   32, 'Male',   'john@example.com',  '9876543211'),
(7,  'Priya Sharma', 28, 'Female', 'priya@example.com', '9876543212'),
(8,  'Rahul Verma',  35, 'Male',   'rahul@example.com', '9876543213'),
(9,  'Sneha Patel',  26, 'Female', 'sneha@example.com', '9876543214'),
(10, 'Amit Kumar',   41, 'Male',   'amit@example.com',  '9876543215');

-- ============================================
-- MOCK PAYMENTS
-- ============================================
INSERT INTO payments (booking_id, amount, payment_method, transaction_id, status, payment_date) VALUES
(1,  4500.00, 'card',       'TXN202608001', 'success', '2026-08-01 10:31:00'),
(2,  4500.00, 'upi',        'TXN202608002', 'success', '2026-08-02 14:16:00'),
(3,  4200.00, 'netbanking', 'TXN202608003', 'success', '2026-08-03 09:46:00'),
(4,  4000.00, 'card',       'TXN202608004', 'success', '2026-08-04 16:21:00'),
(5,  2800.00, 'upi',        'TXN202608005', 'success', '2026-08-05 11:01:00'),
(6,  4100.00, 'card',       'TXN202608006', 'success', '2026-08-06 08:31:00'),
(7,  4000.00, 'upi',        'TXN202608007', 'success', '2026-08-07 13:46:00'),
(8,  2500.00, 'netbanking', 'TXN202608008', 'success', '2026-08-08 19:11:00'),
(9,  3000.00, 'card',       'TXN202608009', 'pending', '2026-08-09 07:26:00'),
(10, 3800.00, 'upi',        'TXN202608010', 'success', '2026-08-10 15:51:00');

-- ============================================
-- SYNC FLIGHT AVAILABLE SEATS COUNT
-- Recalculate available_seats based on actual booked seats
-- ============================================
UPDATE flights f
SET f.available_seats = f.total_seats - (
  SELECT COUNT(*) FROM seats s WHERE s.flight_id = f.id AND s.is_available = FALSE
);
