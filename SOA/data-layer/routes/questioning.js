const express = require('express');
router = express.Router();
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'eu-cdbr-west-01.cleardb.com',
    user: 'bc26cbe11a2b95',
    password: 'b0c49619',
    database: 'heroku_f34fcaaae072900'
});

router.get( '/get_keywords' , ( req , res ) => {
    const query = "SELECT * FROM keyword";
    connection.query( query , ( error, results ) => {
        if ( error ) throw  error;
        res.send( { keywords: results} );
    } )
} )

router.get( '/get_questions' , ( req , res ) => {
    const query = "SELECT question_title FROM question"
    connection.query( query , ( error , results) => {
        if ( error ) throw error;
        res.send( {questions: results } );
    } )
})

router.post( '/add_question' , ( req , res ) => {
    const question_parameters = req.body;
    const query = "INSERT INTO question SET ?";
    connection.query( query , question_parameters , ( error , result ) => {
        if( error ) throw  error;
        /* add_question returns the new created question_id
         */
        res.send({
            question_id: result.insertId
        } );
    })
} )

router.post( '/add_keywords' , ( req , res ) => {
    const new_keywords = req.body[ 'new_keywords' ];
    const query = "INSERT INTO keyword (keyword_title) VALUES ?";
    connection.query( query , [ new_keywords.map( ( el ) => [ el ] ) ] , ( error , result ) => {
        if ( error ) throw error;
        /* MySql returns the id of the first inserted keyword. We can use this formulation in order to present the
        new keyword ids: map -> (el + fs_id) -> {0,...,new_keywords.length-1}
         */
        const fs_id = result.insertId;
        const new_keyword_ids = [...Array( new_keywords.length ).keys()].map( ( el ) => ( el+fs_id ) );
        res.send( {
            new_keyword_ids:new_keyword_ids
        } );
    } );
} );

router.post( '/has_keywords' , ( req , res ) => {
    const question_id = req.body[ 'question_id' ];
    const keywords = req.body[ 'keyword_ids' ];
    const query = "INSERT INTO has_keyword (question_id,keyword_id) VALUES ?"
    connection.query( query , [ keywords.map( (el) => [ question_id , el ] ) ] , ( error , result ) => {
        if ( error ) throw error;
        res.send( result );
    } )
})

router.post('/question_keywords' , ( req , res ) => {
    const question_title = req.body[ 'question_title' ];
    const query = `SELECT k.keyword_title FROM (SELECT h.question_id,h.keyword_id FROM 
                   (SELECT question_id FROM question WHERE question_title = ?) AS i
                   INNER JOIN has_keyword AS h
                   ON h.question_id = i.question_id) AS ii
                   INNER JOIN keyword AS k
                   on k.keyword_id = ii.keyword_id`
    connection.query( query , [ question_title ] , ( error , results ) => {
        if ( error ) throw error;
        res.send( results );
    })
})

router.post('/question_answers' , ( req , res ) => {
    const question_title = req.body[ 'question_title' ];
    const query = `SELECT a.answer_text,a.username,a.date_posted FROM answer AS a
                   INNER JOIN (SELECT question_id FROM question WHERE question_title = ?) AS q
                   ON a.question_id = q.question_id`
    connection.query( query , [ question_title ] , ( error , results ) => {
        if ( error ) throw error;
        res.send( results );
    })
})

router.post('/question_text' , ( req , res ) => {
    const question_title = req.body['question_title'];
    const query = 'SELECT question_text, username, date_asked FROM question WHERE question_title = ?';
    connection.query(query , [question_title] , ( error , result) => {
        if ( error ) throw error;
        res.send(result);
    })
})

router.post('/nothing' , ( req , res ) => {
    console.log(req.body);
    res.send({'new_keyword_ids' : []});
})

module.exports = router;