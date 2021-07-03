const express = require('express');
//const createError = require("http-errors");
const router = express.Router();
const passport = require( 'passport' );
const LocalStrategy = require( 'passport-local' ).Strategy;

const jwt = require( 'jsonwebtoken' );
//const JWTStrategy = require( 'passport-jwt' ).Strategy;
//const ExtractJWT = require( 'passport-jwt' ).ExtractJwt;

//const JWT_SECRET = 'top-secret';


//This will undertake to check if this username, and password exists in the database
passport.use( 'sign-in' , new LocalStrategy( ( username , password , done ) => {

        /* Authenticator sends a post request to the data layer containing a username and a password
           and waits an answer, if this user exists or not
        */

        /* Data layer returns the array result. If this array is empty, then this user doesn't exist.
        */
        let result = [2];

        /* Missing code for the request on the data layer
        */
        if( result === [] ) {
            return done( null , false );
        }
        else {
            return done( null , result[0] );
        }
    })
);

router.post( '/sign_in' , passport.authenticate( 'sign-in' , {session: false } ) , function( req , res ) {
    res.json( {
        user: req.user,
        timestamp : Date.now()
    } );
} )


module.exports = router;

