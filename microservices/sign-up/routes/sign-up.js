const express = require('express');
const router = express.Router();
const axios = require( 'axios' );
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'SignUpDb'
});


router.post( '/sign_up' , ( req , res ) => {
    let user = req.body;
    for( let key in user ) {
        if( ( key!== "username" ) && ( key!== "email" ) && ( key!== "password" ) ) {
            delete user[ key ];
        }
    }
    const options = {
        method: "post",
        url: "http://localhost:5001/add_user",
        data: user
    };

    axios(options).then( (in_res) => {
        console.log( in_res.data);
        const choreographer_options = {
            method: 'post',
            url: 'http://localhost:5000/sign_up',
            data : user
        };
        axios(choreographer_options).then( (choreographer_req) => {
            res.send( choreographer_req.data );
        } ).catch( error => {
            console.log(error);
            res.send(error.response.status);
        } )
    }).catch( (error ) => {
        console.log(error);
        res.send(error.response.status);
    });


} );

router.post('/add_user' , ( req , res ) => {
    const query = "INSERT INTO user SET ?";
    connection.query( query , [ req.body ] , ( error ) => {
        if( error ) console.log(error);
        res.send("User added correctly" );
    })
})


module.exports = router;