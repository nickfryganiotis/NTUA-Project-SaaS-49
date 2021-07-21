CREATE SCHEMA IF NOT EXISTS QuestionsInfo;
USE QuestionsInfo;

CREATE TABLE question (
	question_id INT AUTO_INCREMENT,
    question_title VARCHAR(200),
    question_text VARCHAR(1000),
    date_asked DATETIME default current_timestamp,
    username VARCHAR(100),
    PRIMARY KEY(question_id),
    FOREIGN KEY(username) REFERENCES user(username)
);

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