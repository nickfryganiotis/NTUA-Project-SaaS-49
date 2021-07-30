const express = require('express')
const router = express.Router();
const mysql = require('mysql');

const connection = mysql.createConnection( {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'QuestionTitlesDb',
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
    let myAddress = 'http://localhost:5005/update_question_titles'
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

router.post('/update_question_titles' , ( req , res ) => {
    const question_title = req.body['question_title'];
    const query = 'INSERT INTO question_titles (question_title) VALUES (?)';
    connection.query(query , [ question_title ] , ( error, results) => {
        if ( error ) throw error;
        res.send( results );
    })
})

router.post('/get_question_titles' , ( req , res) => {

})

module.exports = router;