const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const axios = require( 'axios' );


const connection = mysql.createConnection( {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'QuestionsPerKeywordDb',
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
    let myAddress = 'http://localhost:5008/update_questions'
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

    const question_parameters = req.body;
    const question_options = {
        method: "post",
        url: "http://localhost:5008/add_question",

        /* pass only question_title, question_text and username to data-layer component
         */
        data: {
            question_title: question_parameters[ 'question_title' ],
            question_text: question_parameters[ 'question_text' ]
        }
    };

    axios( question_options ).then( ( question_id ) => {
        let keyword_options;
        if(question_parameters['newKeywords'].length > 0) {
            keyword_options = {
                method: "post",
                url: "http://localhost:5008/add_keywords",

                data: {
                    new_keywords: question_parameters[ 'newKeywords' ]
                }
            };
        }
        else {
            keyword_options = {
                method: "post",
                url: "http://localhost:5008/nothing",


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
                    url: "http://localhost:5008/has_keywords",
                    data: {
                        question_id: question_id.data[ 'question_id' ],
                        keyword_ids: merged_keyword_ids
                    }
                };
            }
            else {
                has_keyword_options = {
                    method: "post",
                    url: "http://localhost:5008/nothing",
                    data: {
                        ups: ["ups"]
                    }
                };
            }
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


router.post('/questions_per_keyword' , ( req , res) => {
    const query = `SELECT keyword_title, COUNT(*) as question_number
                   FROM has_keyword h 
                   INNER JOIN keyword k
                   ON k.keyword_id = h.keyword_id
                   GROUP BY keyword_title`
    connection.query( query , ( error , results ) => {
        if ( error ) throw  error;
        res.send( results );
    } )
})

router.post('/nothing' , ( req , res ) => {
    console.log(req.body);
    res.send({'new_keyword_ids' : []});
})

module.exports = router;