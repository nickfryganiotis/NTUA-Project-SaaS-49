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
    database: 'MyContributionsPerDayDb',
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

pool.hget('subscribers','create-question' , async ( error , data ) => {
    let currentSubscribers = JSON.parse( data );
    let alreadySubscribed = false;
    let myAddress = 'http://localhost:5011/update_questions'
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

pool.hget('subscribers','answer-question' , async ( error , data ) => {
    let currentSubscribers = JSON.parse( data );
    let alreadySubscribed = false;
    let myAddress = 'http://localhost:5011/update_answers'
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

router.post('/update_questions' , ( req , res ) => {
    const username = req.body.event['username'];
    const question_title = req.body.event['question_title'];
    const question_text = req.body.event['question_text'];
    const query = 'INSERT INTO question (question_title,question_text,username) VALUES (?,?,?)';
    connection.query( query , [question_title,question_text,username] , ( error , result) => {
        if ( error ) console.log(error);
        res.send( result );
    })
})

router.post('/update_answers' , ( req , res ) => {
    const username = req.body.event['username'];
    const answer_text = req.body.event['answer_text'];
    const question_title = req.body.event['question_title'];
    const query = 'INSERT INTO answer (question_title,answer_text,username) VALUES (?,?,?)';
    connection.query(query , [question_title,answer_text,username] , ( error , result ) => {
        if ( error ) console.log(error);
        res.send( result );
    })
})

router.post('/my_contributions_per_day' , ( req , res ) => {
    const token = req.body[ 'token' ];
    axios.get("http://localhost:5003/whoami" , {headers: {
            Authorization: 'Bearer ' + token //the token is a variable which holds the token
        }
    }).then( (in_res) => {
        const username = in_res.data['user']['username'];
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
    }).catch( e => {
        console.log(e);
        res.send( e.response.status );
    })
})

module.exports = router;