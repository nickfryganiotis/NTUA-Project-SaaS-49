const express = require( 'express' );
//const createError = require("http-errors");
const axios = require( 'axios' );
const router = express.Router();

router.post( '/authenticate' , ( req , res ) => {
    const token = req.body[ 'token' ];
    axios.get("https://ask-me-anything-49-auth.herokuapp.com/whoami" , {headers: {
            Authorization: 'Bearer ' + token //the token is a variable which holds the token
        }
    }).then( (in_res) => {
        //console.log(in_res.data);
        res.send(in_res.data);
    }).catch( ( error ) => {
        console.log( error );
        res.send(error.response.status);
    })
})

module.exports = router;