const express = require('express')
const router = express.Router();
const mysql = require('mysql');
const axios = require( 'axios' );
const passport = require( 'passport' );
const jwt = require( 'jsonwebtoken' );
const JWTStrategy = require( 'passport-jwt' ).Strategy;
const ExtractJWT = require( 'passport-jwt' ).ExtractJwt;

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
    const question_title = req.body.event['question_title'];
    const query = 'INSERT INTO question_titles (question_title) VALUES (?)';
    connection.query(query , [ question_title ] , ( error, results) => {
        if ( error ) console.log(error);
        res.send( results );
    })
})

router.post('/get_question_titles' , ( req , res) => {
    const token = req.body[ 'token' ];
    axios.get("http://localhost:5005/whoami" , {headers: {
            Authorization: 'Bearer ' + token //the token is a variable which holds the token
        }
    }).then( (in_res) => {
        const query = 'SELECT question_title FROM question_titles';
        connection.query( query , ( error , results ) => {
            if ( error ) console.log(error);
            res.send({'question_titles':results})
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