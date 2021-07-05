const express = require('express');
const router = express.Router();
const axios = require( 'axios' );

router.get('/get_keywords' , ( req , res ) => {
    axios.get( 'http://localhost:5002/get_keywords' ).then( ( in_res) => {
        console.log( in_res.data );
        res.send( in_res.data );
    } ).catch( ( error ) => {
        console.log( error );
    } )
})

router.post( '/create_question' , ( req , res ) => {
    const question_parameters = req.body;

    const question_options = {
        method: "post",
        url: "http://localhost:5002/add_question",

        /* pass only question_title, question_text to data-layer component
         */
        data: {
            question_title: question_parameters[ 'question_title' ],
            question_text: question_parameters[ 'question_text' ]
        }
    };

    axios( question_options ).then( ( question_id ) => {
         console.log(  question_parameters[ 'newKeywords' ] );
         const keyword_options = {
             method: "post",
             url: "http://localhost:5002/add_keywords",

             /* pass only question_title, question_text to data-layer component
              */
             data: {
                 new_keywords: question_parameters[ 'newKeywords' ]
             }
         };
         axios( keyword_options ).then( ( new_keyword_ids ) => {
             const merged_keyword_ids = question_parameters[ 'oldKeywords' ].concat(
                 new_keyword_ids.data[ 'new_keyword_ids' ] );
             const has_keyword_options = {
                 method: "post",
                 url: "http://localhost:5002/has_keywords",
                 data: {
                     question_id: question_id.data[ 'question_id' ],
                     keyword_ids: merged_keyword_ids
                 }
             };
             axios( has_keyword_options ).then( ( add_relation ) => {
                 res.send( add_relation.data );
             } ).catch( ( error) => { console.log(error); })
         } ).catch( ( error ) => { console.log( error ); })
    }).catch( (error) => {
        console.log(error);
    })
} )


module.exports = router;