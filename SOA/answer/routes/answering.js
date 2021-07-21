const express = require( 'express' );
const router = express.Router();
const axios = require( 'axios' );

const esb_url = 'http://localhost:5004/authenticate'

router.post('/answer_question' , (req,res) => {
    const token = req.body[ 'token' ];
    const auth_options = {
        method: 'post',
        url: esb_url,
        data: {'token': token}
    };
    axios(auth_options).then( (in_res) => {
        console.log(in_res.data);
        const question_title = req.body[ 'question_title' ];
        const answer_text = req.body[ 'answer_text' ];
        const answer_options = {
            method: 'post',
            url: 'http://localhost:5002/answer_question',
            data: {
                question_title: question_title,
                answer_text: answer_text,
                username: in_res.data[ 'user' ][ 'username' ]
            }
        };
        axios( answer_options ).then( (answer_res) => {
            console.log( answer_res.data );
            res.send( answer_res.data );
        } ).catch( ( error) => {
            console.log( error );
            res.send( error.response.status );
        })
    }).catch( ( error ) => {
        console.log( error );
        res.send(error.response.status);
    })
} )
module.exports = router;