CREATE SCHEMA IF NOT EXISTS AnswerQuestionDb;
USE AnswerQuestionDB;

CREATE TABLE answer (
	answer_id INT AUTO_INCREMENT,
    answer_text VARCHAR(10000),
    question_id INT,
    date_posted DATETIME default current_timestamp,
    username VARCHAR(100),
    PRIMARY KEY(answer_id, question_id),
    FOREIGN KEY(question_id) REFERENCES question(question_id),
    FOREIGN KEY(username) REFERENCES user(username)
);