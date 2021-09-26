CREATE SCHEMA IF NOT EXISTS MyQuestionsDb;
USE MyQuestionsDb;

CREATE TABLE user_question (
    username VARCHAR(100),
    question_title VARCHAR(200),
	date_asked DATETIME default current_timestamp,
    PRIMARY KEY(username,question_title)
);