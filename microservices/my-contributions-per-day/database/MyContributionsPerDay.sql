CREATE SCHEMA IF NOT EXISTS MyContributionsPerDayDb;
USE MyContributionsPerDayDb;

CREATE TABLE contribution_daily (
    date_asked DATETIME default current_timestamp,
    question_frequency INT,
    answer_frequency INT,
    username VARCHAR(100),
    PRIMARY KEY(date_asked,username)
);