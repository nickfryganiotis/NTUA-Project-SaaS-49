const express = require('express')
const router = express.Router();
const axios = require( 'axios' );
const mysql = require('mysql');
const passport = require( 'passport' );
const jwt = require( 'jsonwebtoken' );
const JWTStrategy = require( 'passport-jwt' ).Strategy;
const ExtractJWT = require( 'passport-jwt' ).ExtractJwt;

const connection = mysql.createConnection( {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'AnswerQuestionDb',
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

router.post('/answer_question' , (req,res) => {
    const token = req.body[ 'token' ];
    axios.get("http://localhost:5007/whoami" , {headers: {
            Authorization: 'Bearer ' + token //the token is a variable which holds the token
        }
    }).then( in_res =>
    {
        const question_title = req.body['question_title'];
        const answer_text = req.body['answer_text'];
        const answer_options = {
            method: 'post',
            url: 'http://localhost:5007/answer_question_db',
            data: {
                question_title: question_title,
                answer_text: answer_text,
                username: in_res.data['user']['username']
            }
        };
        axios(answer_options).then((answer_res) => {
            console.log(answer_res.data);
            const choreographer_options = {
                method: 'post',
                url: 'http://localhost:5000/answer_question',
                data : {
                    question_title:  question_title,
                    answer_text: answer_text,
                    username: in_res.data[ 'user' ][ 'username' ]
                }
            };
            axios(choreographer_options).then(( choreographer_req => {
                res.send(choreographer_req.data);
            })).catch( e => {
                console.log(e);
                res.send(e.response.status)
            });
        }).catch((error) => {
            console.log(error);
            res.send(error.response.status);
        })
    }).catch( e => {
        console.log(e)
        res.send(e.response.status);
    })
} )

router.post('/answer_question_db' , ( req , res ) => {
    const question_title = req.body[ 'question_title' ];
    const answer_text = req.body[ 'answer_text' ];
    const username = req.body[ 'username' ];
    const query = `INSERT INTO answer (answer_text,question_title,username) VALUES (?,?,?)`
    connection.query( query , [ answer_text , question_title, username] , ( error , results) => {
        if ( error ) throw error;
        res.send( results );
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