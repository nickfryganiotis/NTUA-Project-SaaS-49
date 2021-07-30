CREATE SCHEMA IF NOT EXISTS SignUpDb;
USE SignUpDb;

CREATE TABLE user (
	username VARCHAR(100),
    password VARCHAR(100),
    PRIMARY KEY(username)
);
