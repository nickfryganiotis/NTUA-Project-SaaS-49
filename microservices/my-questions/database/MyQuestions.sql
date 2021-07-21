CREATE SCHEMA IF NOT EXISTS MyQuestionsDb;
USE MyQuestionsDb;

CREATE TABLE user_question (
    username VARCHAR(100),
    question_title VARCHAR(200),
    PRIMARY KEY(username,question_title)
);