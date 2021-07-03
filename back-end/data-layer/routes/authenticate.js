const express = require('express');
const router = express.Router();
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'AskMeAnythingDB',
});

router.post('/authenticate' , ( req , res ) => {
    const query  = 'SELECT username FROM user WHERE username = ? AND password = ?';
    /* Authenticator sends a post request, containing a username and a password of a user in order to be authenticated,
       to the data layer component.
    */
    const username = req.body[ 'username' ];
    const password = req.body[ 'password' ];
    connection.query( query , [ username , password ] , ( error , result ) => {
        if ( error ) throw error;
        res.send( result );
    })
} )

module.exports = router;