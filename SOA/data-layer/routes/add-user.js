const express = require( 'express' );
const router = express.Router();
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'eu-cdbr-west-01.cleardb.com',
    user: 'bc26cbe11a2b95',
    password: 'b0c49619',
    database: 'heroku_f34fcaaae072900'
});

router.post('/' , ( req , res ) => {
    const query = "INSERT INTO user SET ?";
    connection.query( query , [ req.body ] , ( error ) => {
        if( error ) throw error;
        res.send("User added correctly" );
    })
})

module.exports = router;