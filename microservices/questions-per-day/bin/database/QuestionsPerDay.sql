CREATE SCHEMA IF NOT EXISTS QuestionsPerDayDb;
USE QuestionsPerDayDb;

CREATE TABLE question (
	question_id INT AUTO_INCREMENT,
    question_title VARCHAR(200),
    question_text VARCHAR(1000),
    date_asked DATETIME default current_timestamp,
    PRIMARY KEY(question_id)
);

