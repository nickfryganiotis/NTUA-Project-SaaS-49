CREATE DATABASE AskMeAnything;

--\c AskMeAnything;

CREATE TABLE user_table (
    id  SERIAL PRIMARY KEY,
    first_name  VARCHAR(30),
    last_name   VARCHAR(30),
    username    VARCHAR(50),
    password    VARCHAR(100)
);




