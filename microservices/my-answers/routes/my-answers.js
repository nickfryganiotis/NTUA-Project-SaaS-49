const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const axios = require( 'axios' );
const passport = require( 'passport' );
const jwt = require( 'jsonwebtoken' );
const JWTStrategy = require( 'passport-jwt' ).Strategy;
const ExtractJWT = require( 'passport-jwt' ).ExtractJwt;

const connection = mysql.createConnection( {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'MyAnswersDb',
});

const JWT_SECRET = 'top-secret';

passport.use( 'token' , new JWTStrategy(
    {
        secretOrKey: JWT_SECRET,
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
    }, ( token , done ) => {
        /* token is equal to the access token payload */
        return done( null , { username: token.username } );
    }
) );

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

pool.hget('subscribers','answer-question' , async ( error , data ) => {
    let currentSubscribers = JSON.parse( data );
    let alreadySubscribed = false;
    let myAddress = 'http://localhost:5012/update_answers'
    for( let i = 0; i < currentSubscribers.length; i++ ) {
        if( currentSubscribers[i] == myAddress ) {
            alreadySubscribed = true;
        }
    }
    if( alreadySubscribed == false ) {
        currentSubscribers.push( myAddress );
        pool.hset( 'subscribers' , 'answer-question' , JSON.stringify(currentSubscribers),() => {});
        console.log('subscribed');
    }
    else {
        console.log('already subscribed')
    }

} )

router.post('/update_answers' , ( req , res ) => {
    const username = req.body['username'];
    const question_title = req.body['question_title'];
    const answer_text = req.body['answer_text'];
    const query = 'INSERT INTO answer (?,?,?)'
    connection.query( query , [username,question_title,answer_text] , ( error , results ) => {
        if ( error ) throw error;
        res.send( results );
    })
})

router.post('/my_answers' , ( req , res ) => {
    const token = req.body[ 'token' ];
    axios.get("http://localhost:5012/whoami" , {headers: {
            Authorization: 'Bearer ' + token //the token is a variable which holds the token
        }
    }).then( (in_res) => {
        const username = in_res.data['user']['username'];
        const query = 'SELECT question_title,answer_text FROM answer WHERE username = ?';
        connection.query( query , [username] , ( error , results ) => {
            if ( error ) throw error;
            res.send({'keywords':results})
        })
    }).catch( e => {
        console.log(e);
        res.send( e.response.status );
    })
})

router.get( '/whoami' ,
    passport.authenticate( 'token' , { session: false } ), ( req , res , next ) => {
        //This piece of code is accessible only by authenticated users
        res.send( {
            user: req.user
        } );
    }, ( req , res ) => {
        res.send( { user: req.user } );
    }
);



module.exports = router;