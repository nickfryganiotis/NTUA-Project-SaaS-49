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
    let myAddress = 'http://localhost:5006/update_question'
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
    let myAddress = 'http://localhost:5006/update_answers'
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

router.post( '/question_info' , ( req , res ) => {
    const token = req.body[ 'token' ];
    axios.get("http://localhost:5006/whoami" , {headers: {
            Authorization: 'Bearer ' + token //the token is a variable which holds the token
        }
    }).then( (in_res) => {
        console.log(in_res.data);
        const question_title = req.body[ 'question_title' ];
        const question_text = {
            method: 'post',
            url: 'http://localhost:5006/question_text',
            data: {'question_title':question_title}
        }
        axios( question_text ).then( ( question_text_req ) => {
            const question_keywords = {
                method: 'post',
                url: 'http://localhost:5006/question_keywords',
                data: {'question_title': question_title}
            };

            axios( question_keywords ).then( ( question_keywords_req ) => {
                console.log( question_keywords_req.data );
                const question_answers = {
                    method: 'post',
                    url: 'http://localhost:5006/question_answers',
                    data: {'question_title': question_title}
                }
                axios( question_answers ).then( ( question_answers_req) => {
                    res.send({
                        keywords: question_keywords_req.data,
                        question_text: question_text_req.data,
                        answers: question_answers_req.data
                    });
                } ).catch( ( error ) => {
                    res.send( error.response.status );
                })
            } ).catch( ( error ) => {
                console.log( error );
                res.send( error.response.status );
            }  )
        }).catch( ( error ) => {
            console.log( error );
            res.send( error.response.status );
        })
    } ).catch( e => { console.log( e ); res.send(e.response.status)})

})

router.post('/question_text' , ( req , res ) => {
    const question_title = req.body['question_title'];
    const query = 'SELECT question_text FROM question WHERE question_title = ?';
    connection.query(query , [question_title] , ( error , result) => {
        if ( error ) throw error;
        res.send(result);
    })
})

router.post('/question_keywords' , ( req , res ) => {
    const question_title = req.body[ 'question_title' ];
    const query = `SELECT k.keyword_title FROM (SELECT h.question_id,h.keyword_id FROM 
                   (SELECT question_id FROM question WHERE question_title = ?) AS i
                   INNER JOIN has_keyword AS h
                   ON h.question_id = i.question_id) AS ii
                   INNER JOIN keyword AS k
                   on k.keyword_id = ii.keyword_id`
    connection.query( query , [ question_title ] , ( error , results ) => {
        if ( error ) throw error;
        res.send( results );
    })
})

router.post('/question_answers' , ( req , res ) => {
    const question_title = req.body[ 'question_title' ];
    const query = `SELECT a.answer_text,a.username,a.date_posted FROM answer AS a
                   INNER JOIN (SELECT question_id FROM question WHERE question_title = ?) AS q
                   ON a.question_id = q.question_id`
    connection.query( query , [ question_title ] , ( error , results ) => {
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