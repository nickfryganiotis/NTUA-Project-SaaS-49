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

CREATE SCHEMA IF NOT EXISTS CreateQuestionDb;
USE CreateQuestionDb;

CREATE TABLE question (
	question_id INT AUTO_INCREMENT,
    question_title VARCHAR(200),
    question_text VARCHAR(1000),
    date_asked DATETIME default current_timestamp,
    username VARCHAR(100),
    PRIMARY KEY(question_id)
);

CREATE TABLE keyword (
	keyword_id INT AUTO_INCREMENT,
    keyword_title VARCHAR(20),
    PRIMARY KEY(keyword_id)
);

CREATE TABLE has_keyword (
	question_id INT,
    keyword_id INT,
    PRIMARY KEY(question_id, keyword_id),
    FOREIGN KEY(question_id) REFERENCES question(question_id),
    FOREIGN KEY(keyword_id) REFERENCES keyword(keyword_id)
);


CREATE SCHEMA IF NOT EXISTS GetKeywordsDb;
USE GetKeywordsDb;

CREATE TABLE keyword (
	keyword_id INT AUTO_INCREMENT,
    keyword_title VARCHAR(20),
    PRIMARY KEY(keyword_id)
);

CREATE SCHEMA IF NOT EXISTS LoginDb;
USE LoginDb;

CREATE TABLE user (
	username VARCHAR(100),
    password VARCHAR(100),
    PRIMARY KEY(username)
);

CREATE SCHEMA IF NOT EXISTS MyAnswersDb;
USE MyAnswersDb;

CREATE TABLE answer (
	username VARCHAR(100),
    answer_text VARCHAR(200),
    question_title VARCHAR(200),
	date_posted DATETIME default current_timestamp,
    PRIMARY KEY(username, question_title,answer_text)
);

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

CREATE SCHEMA IF NOT EXISTS MyQuestionsDb;
USE MyQuestionsDb;

CREATE TABLE user_question (
    username VARCHAR(100),
    question_title VARCHAR(200),
	date_asked DATETIME default current_timestamp,
    PRIMARY KEY(username,question_title)
);

CREATE SCHEMA IF NOT EXISTS QuestionTitlesDb;
USE QuestionTitlesDb;

CREATE TABLE question_titles (
	question_id INT AUTO_INCREMENT,
    question_title VARCHAR(200),
    PRIMARY KEY(question_id)
);


CREATE SCHEMA IF NOT EXISTS QuestionInfoDb;
USE QuestionInfoDb;

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

CREATE TABLE keyword (
	keyword_id INT AUTO_INCREMENT,
    keyword_title VARCHAR(20),
    PRIMARY KEY(keyword_id)
);

CREATE TABLE has_keyword (
	question_id INT,
    keyword_id INT,
    PRIMARY KEY(question_id, keyword_id),
    FOREIGN KEY(question_id) REFERENCES question(question_id),
    FOREIGN KEY(keyword_id) REFERENCES keyword(keyword_id)
);

CREATE SCHEMA IF NOT EXISTS QuestionsPerDayDb;
USE QuestionsPerDayDb;

CREATE TABLE question (
	question_id INT AUTO_INCREMENT,
    question_title VARCHAR(200),
    question_text VARCHAR(1000),
    date_asked DATETIME default current_timestamp,
    PRIMARY KEY(question_id)
);




CREATE SCHEMA IF NOT EXISTS QuestionsPerKeywordDb;
USE QuestionsPerKeywordDb;

CREATE TABLE question (
	question_id INT AUTO_INCREMENT,
    question_title VARCHAR(200),
    question_text VARCHAR(1000),
    date_asked DATETIME default current_timestamp,
    PRIMARY KEY(question_id)
);

CREATE TABLE keyword (
	keyword_id INT AUTO_INCREMENT,
    keyword_title VARCHAR(20),
    PRIMARY KEY(keyword_id)
);

CREATE TABLE has_keyword (
	question_id INT,
    keyword_id INT,
    PRIMARY KEY(question_id, keyword_id),
    FOREIGN KEY(question_id) REFERENCES question(question_id),
    FOREIGN KEY(keyword_id) REFERENCES keyword(keyword_id)
);


CREATE SCHEMA IF NOT EXISTS SignUpDb;
USE SignUpDb;

CREATE TABLE user (
	username VARCHAR(100),
    password VARCHAR(100),
    PRIMARY KEY(username)
);
