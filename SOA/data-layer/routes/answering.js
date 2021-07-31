const express = require('express');
router = express.Router();
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'eu-cdbr-west-01.cleardb.com',
    user: 'bc26cbe11a2b95',
    password: 'b0c49619',
    database: 'heroku_f34fcaaae072900'
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