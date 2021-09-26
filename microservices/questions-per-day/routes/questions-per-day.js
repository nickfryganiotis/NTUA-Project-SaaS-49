const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const axios = require( 'axios' );


const connection = mysql.createConnection( {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'QuestionsPerDayDb',
});


//Redis Connection
const REDIS_PORT = 6379;
const REDIS_HOST = 'localhost';
const TotalConnections = 20;
const pool = require('redis-connection-pool')('myRedisPool', {
    host: REDIS_HOST,
    port: REDIS_PORT,
    max_clients: TotalConnections,
    perform_checks: false,
    database: 0
});
console.log('connected to redis');

pool.hget('subscribers','create-question' , async ( error , data ) => {
    let currentSubscribers = JSON.parse( data );
    let alreadySubscribed = false;
    let myAddress = 'http://localhost:5009/update_question'
    for( let i = 0; i < currentSubscribers.length; i++ ) {
        if( currentSubscribers[i] == myAddress ) {
            alreadySubscribed = true;
        }
    }
    if( alreadySubscribed == false ) {
        currentSubscribers.push( myAddress );
        pool.hset( 'subscribers' , 'create-question' , JSON.stringify(currentSubscribers),() => {});
        console.log('subscribed');
    }
    else {
        console.log('already subscribed')
    }

} )
router.post( '/update_question' , ( req , res ) => {

    const question_parameters = req.body.event;
    const query = 'INSERT INTO question (question_title,question_text) VALUES (?,?)';
    connection.query(query , [question_parameters['question_title'] , question_parameters['question_text']] ,( error , results) => {
        if (error) console.log(error);
        res.send(results);
    } )

} )

router.post('/questions_per_day' , ( req , res) => {
    const query = `SELECT date(q.date_asked) as day,COUNT(*) as question_number
                   FROM question q
                   GROUP BY date(q.date_asked)`;
    connection.query( query , ( error , results ) => {
        if ( error ) console.log(error);
        res.send( results );
    } )
})



module.exports = router;