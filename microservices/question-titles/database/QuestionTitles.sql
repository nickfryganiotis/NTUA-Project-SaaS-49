CREATE SCHEMA IF NOT EXISTS QuestionTitlesDb;
USE QuestionTitlesDb;

CREATE TABLE question_titles (
	question_id INT AUTO_INCREMENT,
    question_title VARCHAR(200),
    PRIMARY KEY(question_id)
);