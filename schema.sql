-- GitHub Profile Analyzer — Database Schema
-- Run this file to set up the database:
--   mysql -u root -p < schema.sql
--
-- To export the running database later:
--   mysqldump -u root -p github_analyzer > schema.sql

CREATE DATABASE IF NOT EXISTS github_analyzer;
USE github_analyzer;

CREATE TABLE IF NOT EXISTS github_profiles (
    id                      INT AUTO_INCREMENT PRIMARY KEY,
    username                VARCHAR(255) NOT NULL UNIQUE,
    name                    VARCHAR(255),
    bio                     TEXT,
    avatar_url              VARCHAR(500),
    html_url                VARCHAR(500),
    location                VARCHAR(255),
    company                 VARCHAR(255),
    blog                    VARCHAR(500),
    twitter_username        VARCHAR(255),
    public_repos            INT DEFAULT 0,
    public_gists            INT DEFAULT 0,
    followers               INT DEFAULT 0,
    following               INT DEFAULT 0,
    account_created_at      DATETIME,
    last_updated_on_github  DATETIME,
    analyzed_at             TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
