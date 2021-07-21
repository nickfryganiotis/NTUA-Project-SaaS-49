CREATE SCHEMA IF NOT EXISTS MyAnswersDb;
USE MyAnswersDb;

CREATE TABLE user_answers (
	username VARCHAR(100),
    answer_text VARCHAR(10000),
    question_title VARCHAR(200),
    PRIMARY KEY(username, question_title,answer_text)
);