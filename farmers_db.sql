-- Create the database
CREATE DATABASE IF NOT EXISTS farmers_db;

-- Use the database
USE farmers_db;

-- Table for farmers
CREATE TABLE IF NOT EXISTS farmers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    mobile VARCHAR(15),
    country VARCHAR(50),
    state VARCHAR(50)
);

-- Table for schemes
CREATE TABLE IF NOT EXISTS schemes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    amount DECIMAL(18, 2) NOT NULL,
    expiry_date DATE NOT NULL,
    description TEXT
);

-- Table for loan requests
CREATE TABLE IF NOT EXISTS loan_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    farmer_id INT,
    scheme_id INT,
    status ENUM('Pending', 'Approved', 'Denied') DEFAULT 'Pending',
    reason TEXT,
    FOREIGN KEY (farmer_id) REFERENCES farmers(id),
    FOREIGN KEY (scheme_id) REFERENCES schemes(id)
);
