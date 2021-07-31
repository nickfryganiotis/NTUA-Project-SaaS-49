const express = require('express');
//const createError = require("http-errors");
const router = express.Router();
const passport = require( 'passport' );
const LocalStrategy = require( 'passport-local' ).Strategy;

const jwt = require( 'jsonwebtoken' );
const axios = require( 'axios' );
const JWTStrategy = require( 'passport-jwt' ).Strategy;
const ExtractJWT = require( 'passport-jwt' ).ExtractJwt;

const JWT_SECRET = 'top-secret';


//This will undertake to check if this username, and password exists in the database
passport.use( 'sign-in' , new LocalStrategy( ( username , password , done ) => {

        /* Authenticator sends a post request to the data layer containing a username and a password
           and waits an answer, if this user exists or not
        */

        /* Data layer returns the array result. If this array is empty, then this user doesn't exist.
        */
        const options = {
            method: "post",
            url: "https://ask-me-anything-49-data-layer.herokuapp.com/authenticate",
            data: {
                username: username,
                password: password
            }
        };
        axios(options).then( (res) => {
            console.log(res);
            const result = res.data;
            if( result === [] ) {
                return done( null , false );
            }
            else {
                return done( null , result[0] );
            }
        }).catch( (error ) => {
            console.log(error)
        });

        /* Missing code for the request on the data layer
        */

    })
);

//Header(Request) -> Authorization: Bearer token
passport.use( 'token' , new JWTStrategy(
    {
        secretOrKey: JWT_SECRET,
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
    }, ( token , done ) => {
        /* token is equal to the access token payload */
        return done( null , { username: token.username } );
    }
) )

router.post( '/sign_in' , passport.authenticate( 'sign-in' , {session: false } ) , ( req , res ) => {
    res.send( {
        token:jwt.sign( req.user , JWT_SECRET , { expiresIn: 3600 } )
    } );
} )

router.post( '/sign_up' , ( req , res ) => {
    let user = req.body;
    for( let key in user ) {
        if( ( key!== "username" ) && ( key!== "email" ) && ( key!== "password" ) ) {
            delete user[ key ];
        }
    }
    const options = {
        method: "post",
        url: "https://ask-me-anything-49-data-layer.herokuapp.com/add_user",
        data: user
    };

    axios(options).then( (in_res) => {
        console.log(in_res.data);
        res.send(in_res.data);
    }).catch( (error ) => {
        console.log(error)
    });


} );

//GET whoami. I have an access token. If it is valid get the payload back

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

