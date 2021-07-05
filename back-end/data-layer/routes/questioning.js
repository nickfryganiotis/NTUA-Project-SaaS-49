const express = require('express');
router = express.Router();
const mysql = require('mysql');

const connection = mysql.createConnection( {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'AskMeAnythingDB',
});

router.get( '/get_keywords' , ( req , res ) => {
    const query = "SELECT * FROM keyword";
    connection.query( query , ( error, results ) => {
        if ( error ) throw  error;
        res.send( { keywords: results} );
    } )
} )

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

module.exports = router;