const express = require( 'express' );
const router = express.Router();
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'askmeanythingdb'
});

router.post('/' , ( req , res ) => {
    const query = "INSERT INTO user SET ?";
    connection.query( query , [ req.body ] , ( error ) => {
        if( error ) throw error;
        res.send("User added correctly" );
    })
})

module.exports = router;