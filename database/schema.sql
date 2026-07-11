-- Create Database
CREATE DATABASE IF NOT EXISTS interior_design;
USE interior_design;

-- Users Table Definition
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Rooms Table Definition (Uploaded Rooms Log)
CREATE TABLE IF NOT EXISTS rooms (
    id VARCHAR(255) PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    room_type VARCHAR(100) NOT NULL,
    style VARCHAR(100) NOT NULL,
    original_image LONGTEXT NOT NULL,
    redesigned_image LONGTEXT NOT NULL,
    date VARCHAR(100) NOT NULL
);

-- Recommendations Table Definition (AI Suggestion Details)
CREATE TABLE IF NOT EXISTS recommendations (
    id VARCHAR(255) PRIMARY KEY,
    room_id VARCHAR(255) NOT NULL,
    palette TEXT NOT NULL,
    furniture TEXT NOT NULL,
    lighting TEXT NOT NULL,
    decor TEXT NOT NULL,
    budget TEXT NOT NULL,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
);
