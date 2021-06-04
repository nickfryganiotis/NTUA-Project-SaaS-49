const express = require("express");
const router = express.Router();
const passport = require('passport')
const LocalStrategy = require( 'passport-local' ).Strategy;
const Pool = require('pg').Pool;

const pool = new Pool(
    {
        "user":"Postgres",
        "password": "timda",
        "databse": "AskMeAnything",
        "host": "localhost",
        "port": 5432
    });

module.exports = router;

