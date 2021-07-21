CREATE SCHEMA IF NOT EXISTS QuestionsPerDayDb;
USE QuestionsPerDayDb;

CREATE TABLE questions_daily (
    date_asked DATETIME default current_timestamp,
    frequency INT,
    PRIMARY KEY(date_asked)
);