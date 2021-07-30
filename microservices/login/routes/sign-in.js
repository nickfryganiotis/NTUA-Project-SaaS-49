const express = require('express');
router = express.Router();
const mysql = require('mysql');
const passport = require( 'passport' );
const LocalStrategy = require( 'passport-local' ).Strategy;
const jwt = require( 'jsonwebtoken' );
const axios = require( 'axios' );
const JWT_SECRET = 'top-secret';


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'LoginDb',
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

pool.hget('subscribers','sign-up' , async ( error , data ) => {
    let currentSubscribers = JSON.parse( data );
    let alreadySubscribed = false;
    let myAddress = 'http://local' +
        'host:5004/add_user'
    for( let i = 0; i < currentSubscribers.length; i++ ) {
        if( currentSubscribers[i] == myAddress ) {
            alreadySubscribed = true;
        }
    }
    if( alreadySubscribed == false ) {
        currentSubscribers.push( myAddress );
        pool.hset( 'subscribers' , 'sign-up' , JSON.stringify(currentSubscribers),() => {});
        console.log('subscribed');
    }
    else {
        console.log('already subscribed')
    }

} )

passport.use( 'sign-in' , new LocalStrategy( ( username , password , done ) => {

        /* Authenticator sends a post request to the data layer containing a username and a password
           and waits an answer, if this user exists or not
        */

        /* Data layer returns the array result. If this array is empty, then this user doesn't exist.
        */
        const options = {
            method: "post",
            url: "http://localhost:5004/authenticate",
            data: {
                username: username,
                password: password
            }
        };
        axios(options).then( (res) => {
            console.log(res);
            const result = res.data;
            if( result === [] ) {
                return done( null , false );
            }
            else {
                return done( null , result[0] );
            }
        }).catch( (error ) => {
            console.log(error)
        });

        /* Missing code for the request on the data layer
        */

    })
);

router.post('/authenticate' , ( req , res ) => {
    const query  = 'SELECT username FROM user WHERE username = ? AND password = ?';
    const username = req.body[ 'username' ];
    const password = req.body[ 'password' ];
    connection.query( query , [ username , password ] , ( error , result ) => {
        if ( error ) throw error;
        res.send( result );
    })
})

router.post( '/sign_in' , passport.authenticate( 'sign-in' , {session: false } ) , ( req , res ) => {
    res.send( {
        token:jwt.sign( req.user , JWT_SECRET , { expiresIn: 3600 } )
    } );
} )

router.post('/add_user' , ( req , res ) => {
    const user = req.body.event;
    const query = 'INSERT INTO USER SET ?'
    connection.query( query , user , ( error , results) => {
        if ( error ) throw  error;
        res.send( results );
    } )
})

module.exports = router;