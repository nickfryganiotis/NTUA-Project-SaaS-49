CREATE SCHEMA IF NOT EXISTS LoginDb;
USE LoginDb;

CREATE TABLE user (
	username VARCHAR(100),
    password VARCHAR(100),
    PRIMARY KEY(username)
);