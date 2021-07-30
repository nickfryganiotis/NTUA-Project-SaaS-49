CREATE SCHEMA IF NOT EXISTS AnswerQuestionDb;
USE AnswerQuestionDB;

CREATE TABLE answer (
	answer_id INT AUTO_INCREMENT,
    answer_text VARCHAR(10000),
    question_title VARCHAR(200),
    date_posted DATETIME default current_timestamp,
    username VARCHAR(100),
    PRIMARY KEY(answer_id, question_title)
);