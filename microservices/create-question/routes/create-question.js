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
    database: 'CreateQuestionDb',
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

router.post( '/create_question' , ( req , res ) => {
    const token = req.body[ 'token' ];
    axios.get("http://localhost:5002/whoami" , {headers: {
            Authorization: 'Bearer ' + token //the token is a variable which holds the token
        }
    }).then( (in_res) => {
        console.log(in_res.data);
        const question_parameters = req.body;

        const question_options = {
            method: "post",
            url: "http://localhost:5002/add_question",

            /* pass only question_title, question_text and username to data-layer component
             */
            data: {
                question_title: question_parameters[ 'question_title' ],
                question_text: question_parameters[ 'question_text' ],
                username: in_res.data[ 'user' ][ 'username' ]
            }
        };

        axios( question_options ).then( ( question_id ) => {
            console.log(  question_parameters[ 'newKeywords' ] );
            let keyword_options;
            if(question_parameters['newKeywords'].length > 0) {
                keyword_options = {
                    method: "post",
                    url: "http://localhost:5002/add_keywords",


                    data: {
                        new_keywords: question_parameters[ 'newKeywords' ]
                    }
                };
            }
            else {
                keyword_options = {
                    method: "post",
                    url: "http://localhost:5002/nothing",


                    data: {
                        ups: ["ups"]
                    }
                };
            }
            axios( keyword_options ).then( ( new_keyword_ids ) => {
                const merged_keyword_ids = question_parameters[ 'oldKeywords' ].concat(
                    new_keyword_ids.data[ 'new_keyword_ids' ] );
                let has_keyword_options;
                if ( merged_keyword_ids.length > 0) {
                    has_keyword_options =  {
                        method: "post",
                        url: "http://localhost:5002/has_keywords",
                        data: {
                            question_id: question_id.data[ 'question_id' ],
                            keyword_ids: merged_keyword_ids
                        }
                    };
                }
                else {
                    has_keyword_options = {
                        method: "post",
                        url: "http://localhost:5002/nothing",
                        data: {
                            ups: ["ups"]
                        }
                    };
                }
                axios( has_keyword_options ).then( ( add_relation ) => {
                    const choreographer_options = {
                        method: 'post',
                        url: 'http://localhost:5000/create_question',
                        data : {
                            question_title: question_parameters[ 'question_title' ],
                            question_text: question_parameters[ 'question_text' ],
                            username: in_res.data[ 'user' ][ 'username' ],
                            oldKeywords: question_parameters['oldKeywords'],
                            newKeywords: question_parameters[ 'newKeywords' ]
                        }
                    };
                    axios(choreographer_options).then( (choreographer_req) => {
                        res.send( choreographer_req.data );
                    } ).catch( error => {
                        console.log(error);
                        res.send(error.response.status);
                    } )

                } ).catch( ( error) => { console.log(error); })
            } ).catch( ( error ) => { console.log( error ); })
        }).catch( (error) => {
            console.log(error);
        })
    }).catch( ( error ) => {
        console.log( error );
        res.send(error.response.status);
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

router.post('/nothing' , ( req , res ) => {
    console.log(req.body);
    res.send({'new_keyword_ids' : []});
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