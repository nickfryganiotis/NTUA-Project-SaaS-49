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
    const query = `SELECT keyword_title, COUNT(*) as question_number
                   FROM has_keyword h 
                   INNER JOIN keyword k
                   ON k.keyword_id = h.keyword_id
                   GROUP BY keyword_title`
    connection.query( query , ( error , results ) => {
        if ( error ) throw  error;
        res.send( results );
    } )
})

router.get( '/questions_per_day' , ( req , res ) => {
    const query = `SELECT date(q.date_asked) as day,COUNT(*) as question_number
                   FROM question q
                   GROUP BY date(q.date_asked)`;
    connection.query( query , ( error , results ) => {
        if ( error ) throw error;
        res.send( results );
    } )
})

router.post( '/my_questions' , ( req , res ) => {
    const username = req.body[ 'username' ];
    const query = 'SELECT question_title FROM question WHERE username = ?';
    connection.query( query , [ username ] , ( error , results) => {
        if ( error ) throw error;
        res.send( results );
    } );
})

router.post( '/my_answers' , ( req , res ) => {
    const username = req.body[ 'username' ];
    const query = `SELECT a.answer_id,a.answer_text,a.date_posted,q.question_title
                   FROM answer a
                   LEFT OUTER JOIN question q
                   ON a.question_id = q.question_id
                   WHERE a.username = ?`
    connection.query( query , [ username ] , ( error , results) => {
        if ( error ) throw  error;
        res.send( results );
    } )
})

router.post('/my_questions_per_day' , ( req , res ) => {
    const username = req.body[ 'username' ];
    const query = `SELECT date(q.date_asked) as day,COUNT(*) as question_number
                   FROM question q
                   WHERE q.username = ?
                   GROUP BY date(q.date_asked)`

    connection.query( query , [ username ] , ( error , results) => {
        if ( error ) throw  error;
        res.send( results );
    } )
})

router.post('/my_answers_per_day' , ( req , res ) => {
    const username = req.body[ 'username' ];
    const query = `SELECT date(a.date_posted) as day,COUNT(*) as answer_number
                   FROM answer a
                   WHERE a.username = ?
                   GROUP BY date(a.date_posted)`
})

router.post('/my_contributions_per_day' , ( req , res) => {
    const username = req.body[ 'username' ];
    const query = ` SELECT * FROM 
                    (SELECT COUNT(*) as count1, DATE(q.date_asked) as date1
                    FROM question q
                    WHERE q.username = ?
                    GROUP BY DATE(q.date_asked)) r1
                    LEFT OUTER JOIN 
                    (SELECT COUNT(*) as count2, DATE(a.date_posted) as date2
                    FROM answer a
                    WHERE a.username = ?
                    GROUP BY DATE(a.date_posted)) r2
                    ON r1.date1 = r2.date2
                    UNION
                    SELECT * FROM
                    (SELECT COUNT(*) as count1, DATE(q.date_asked) as date1
                    FROM question q
                    WHERE q.username = ?
                    GROUP BY DATE(q.date_asked)) r1
                    RIGHT OUTER JOIN 
                    (SELECT COUNT(*) as count2, DATE(a.date_posted) as date2
                    FROM answer a
                    WHERE a.username = ?
                    GROUP BY DATE(a.date_posted)) r2
                    ON r1.date1 = r2.date2`
    connection.query( query , [ username , username , username , username ] , ( error , results ) => {
        if ( error ) throw  error;
        res.send( results );
    })
} )



module.exports = router;