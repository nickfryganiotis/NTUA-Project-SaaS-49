CREATE SCHEMA IF NOT EXISTS MyAnswersDb;
USE MyAnswersDb;

CREATE TABLE answer (
	username VARCHAR(100),
    answer_text VARCHAR(200),
    question_title VARCHAR(200),
	date_posted DATETIME default current_timestamp,
    PRIMARY KEY(username, question_title,answer_text)
);