CREATE SCHEMA IF NOT EXISTS QuestionsPerKeywordDb;
USE QuestionsPerKeywordDb;

CREATE TABLE keyword_frequency (
    keyword_title VARCHAR(20),
    frequency INT ,
    PRIMARY KEY(keyword_id)
);