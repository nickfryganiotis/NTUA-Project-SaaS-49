CREATE SCHEMA IF NOT EXISTS MyContributionsPerDayDb;
USE MyContributionsPerDayDb;

CREATE TABLE question (
	question_id INT AUTO_INCREMENT,
    question_title VARCHAR(200),
    question_text VARCHAR(1000),
    date_asked DATETIME default current_timestamp,
    username VARCHAR(100),
    PRIMARY KEY(question_id)
);

CREATE TABLE answer (
	answer_id INT AUTO_INCREMENT,
    answer_text VARCHAR(10000),
    question_title VARCHAR(200),
    date_posted DATETIME default current_timestamp,
    username VARCHAR(100),
    PRIMARY KEY(answer_id, question_title)
);