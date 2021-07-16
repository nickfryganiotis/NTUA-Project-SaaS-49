const express = require( 'express' );
const router = express.Router();
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'AskMeAnythingDB'
});

router.get( '/questions_per_keyword' , ( req  , res ) => {
    const query = `SELECT COUNT(*) 
                   FROM has_keyword h 
                   INNER JOIN keyword k
                   ON k.keyword_id = h.keyword_id
                   GROUP BY keyword_name`
    connection.query( query , ( error , results ) => {
        if ( error ) throw  error;
        res.send( results );
    } )
})

router.get( '/questions_per_day' , ( req , res ) => {
    const query = `SELECT COUNT(*)
                   FROM question q
                   GROUP BY date(q.date_asked)`;
    connection.query( query , ( error , results ) => {
        if ( error ) throw error;
        res.send( results );
    } )
})



module.exports = router;