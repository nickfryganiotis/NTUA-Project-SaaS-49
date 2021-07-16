const express = require( 'express' );
//const createError = require("http-errors");
const axios = require( 'axios' );
const router = express.Router();

const esb_url = 'http://localhost:5004/authenticate'

router.post('/questions_per_keyword' , ( req , res) => {
    const token = req.body[ 'token' ];
    const options = {
        method: "post",
        url: esb_url,
        data: {token: token}
    };

    axios(options).then( (in_res) => {
        console.log(in_res.data);
        res.send(in_res.data);
    }).catch( (error ) => {
        console.log(error)
    });

})

module.exports = router;