const express = require('express');
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
    database: 'QuestionInfoDb',
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

router.post( '/update_question' , ( req , res ) => {

        const question_parameters = req.body;
        const question_options = {
            method: "post",
            url: "http://localhost:5006/add_question",

            /* pass only question_title, question_text and username to data-layer component
             */
            data: {
                question_title: question_parameters[ 'question_title' ],
                question_text: question_parameters[ 'question_text' ],
                username: question_parameters[ 'username' ]
            }
        };

        axios( question_options ).then( ( question_id ) => {
            const keyword_options = {
                method: "post",
                url: "http://localhost:5006/add_keywords",

                data: {
                    new_keywords: question_parameters[ 'newKeywords' ]
                }
            };
            axios( keyword_options ).then( ( new_keyword_ids ) => {
                const merged_keyword_ids = question_parameters[ 'oldKeywords' ].concat(
                    new_keyword_ids.data[ 'new_keyword_ids' ] );
                const has_keyword_options = {
                    method: "post",
                    url: "http://localhost:5006/has_keywords",
                    data: {
                        question_id: question_id.data[ 'question_id' ],
                        keyword_ids: merged_keyword_ids
                    }
                };
                axios( has_keyword_options ).then( ( add_relation ) => {
                    res.send(add_relation.data);

                } ).catch( ( error) => { console.log(error); })
            } ).catch( ( error ) => { console.log( error ); })
        }).catch( (error) => {
            console.log(error);
        })



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