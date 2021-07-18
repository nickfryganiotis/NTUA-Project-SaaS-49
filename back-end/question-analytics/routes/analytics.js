const express = require( 'express' );
//const createError = require("http-errors");
const axios = require( 'axios' );
const router = express.Router();

const esb_url = 'http://localhost:5004/authenticate'


router.post('/questions_per_keyword' , ( req , res) => {
    const token = req.body[ 'token' ];
    const auth_options = {
        method: 'post',
        url: esb_url,
        data: {'token': token}
    };
    axios(auth_options).then( (in_res) => {
        console.log(in_res.data);
        axios.get( 'http://localhost:5002/questions_per_keyword' ).then( ( in_req ) => {
            res.send( in_req.data );
        } ).catch( ( error ) => {
            console.log( error );
            res.send( error.status );
        } )
    }).catch( (error ) => {
        console.log(error)
        res.send(error.response.status);
    });

})

module.exports = router;