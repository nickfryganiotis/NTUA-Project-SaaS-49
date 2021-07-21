CREATE SCHEMA IF NOT EXISTS GetKeywordsDb;
USE GetKeywordsDb;

CREATE TABLE keyword (
	keyword_id INT AUTO_INCREMENT,
    keyword_title VARCHAR(20),
    PRIMARY KEY(keyword_id)
);