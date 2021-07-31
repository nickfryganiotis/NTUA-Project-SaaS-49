const express = require('express');
const router = express.Router();
const axios = require( 'axios' );

const esb_url = 'https://ask-me-anything-49-esb.herokuapp.com/authenticate'

router.post('/get_keywords' , ( req , res ) => {
    const token = req.body[ 'token' ];
    const auth_options = {
        method: 'post',
        url: esb_url,
        data: {'token': token}
    };
    axios(auth_options).then( (in_res) => {
        console.log(in_res.data);
        axios.get( 'https://ask-me-anything-49-data-layer.herokuapp.com/get_keywords' ).then( ( in_req) => {
            console.log( in_req.data );
            res.send( in_req.data );
        } ).catch( ( error ) => {
            console.log( error );
            res.send( error.response.status );
        } )
    }).catch( ( error ) => {
        console.log( error );
        res.send(error.response.status);
    })

})

router.post( '/get_questions' , ( req , res ) => {
    const token = req.body[ 'token' ];
    const auth_options = {
        method: 'post',
        url: esb_url,
        data: {'token': token}
    };
    axios(auth_options).then( (in_res) => {
        console.log(in_res.data);
        axios.get( 'https://ask-me-anything-49-data-layer.herokuapp.com/get_questions' ).then( ( in_req) => {
            console.log( in_req.data );
            res.send( in_req.data );
        } ).catch( ( error ) => {
            console.log( error );
            res.send( error.response.status );
        } )
    }).catch( ( error ) => {
        console.log( error );
        res.send(error.response.status);
    })
})

router.post( '/question_info' , ( req , res ) => {
    const token = req.body[ 'token' ];
    const auth_options = {
        method: 'post',
        url: esb_url,
        data: {'token': token}
    };
    axios(auth_options).then( (in_res) => {
        console.log(in_res.data);
        const question_title = req.body[ 'question_title' ];
        const question_text = {
            method: 'post',
            url: 'https://ask-me-anything-49-data-layer.herokuapp.com/question_text',
            data: {'question_title':question_title}
        }
        axios( question_text ).then( ( question_text_req ) => {
            const question_keywords = {
                method: 'post',
                url: 'https://ask-me-anything-49-data-layer.herokuapp.com/question_keywords',
                data: {'question_title': question_title}
            };

            axios( question_keywords ).then( ( question_keywords_req ) => {
                console.log( question_keywords_req.data );
                const question_answers = {
                    method: 'post',
                    url: 'https://ask-me-anything-49-data-layer.herokuapp.com/question_answers',
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

router.post( '/create_question' , ( req , res ) => {
    const token = req.body[ 'token' ];
    const auth_options = {
        method: 'post',
        url: esb_url,
        data: {'token': token}
    };
    axios(auth_options).then( (in_res) => {
        console.log(in_res.data);
        const question_parameters = req.body;

        const question_options = {
            method: "post",
            url: "https://ask-me-anything-49-data-layer.herokuapp.com/add_question",

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
                    url: "https://ask-me-anything-49-data-layer.herokuapp.com/add_keywords",


                    data: {
                        new_keywords: question_parameters[ 'newKeywords' ]
                    }
                };
            }
            else {
                keyword_options = {
                    method: "post",
                    url: "https://ask-me-anything-49-data-layer.herokuapp.com/nothing",


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
                        url: "https://ask-me-anything-49-data-layer.herokuapp.com/has_keywords",
                        data: {
                            question_id: question_id.data[ 'question_id' ],
                            keyword_ids: merged_keyword_ids
                        }
                    };
                }
                else {
                    has_keyword_options = {
                        method: "post",
                        url: "https://ask-me-anything-49-data-layer.herokuapp.com/nothing",
                        data: {
                            ups: ["ups"]
                        }
                    };
                }
                axios( has_keyword_options ).then( ( add_relation ) => {
                    res.send( add_relation.data );
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


module.exports = router;