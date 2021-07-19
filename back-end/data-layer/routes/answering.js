const express = require('express');
router = express.Router();
const mysql = require('mysql');

const connection = mysql.createConnection( {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'AskMeAnythingDB',
});

router.post('/' , ( req , res ) => {
    const question_title = req.body[ 'question_title' ];
    const answer_text = req.body[ 'answer_text' ];
    const username = req.body[ 'username' ];
    const query = `INSERT INTO answer (answer_text,question_id,username) VALUES (?,(SELECT question_id FROM 
                   question WHERE question_title = ?),?)`
    connection.query( query , [ answer_text , question_title, username] , ( error , results) => {
        if ( error ) throw error;
        res.send( results );
    })
})

module.exports = router;