const express = require('express');
const createError = require("http-errors");
const router = express.Router();
const passport = require( 'passport' );
const LocalStrategy = require( 'passport-local' ).Strategy;

const jwt = require( 'jsonwebtoken' );
const JWTStrategy = require( 'passport-jwt' ).Strategy;
const ExtractJWT = require( 'passport-jwt' ).ExtractJwt;

const JWT_SECRET = 'top-secret';
const Pool = require('pg').Pool;

const pool = new Pool(
    {
        "user":"Postgres",
        "password": "timda",
        "databse": "AskMeAnything",
        "host": "localhost",
        "port": 5432
    });

//This will undertake to check if this username, and password exists in the database
passport.use( 'sign-in' , new LocalStrategy( ( username , password , done ) => {
            const query = "SELECT * FROM user_table WHERE (username = $1 AND password = $2)";
            const input = [ username , password ];
            pool.query( query , input , ( err , result ) => {
                    if ( result === [] ) {
                            return done( null , false );
                    }
                    else {
                            return done( null , result );
                    }
            } )
    } )
);

passport.use( 'token' , new JWTStrategy( {
            secretOrKey: JWT_SECRET,   //In case of a real RSA key we should include here private and public key
            jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()          //Whera access token can be given, in order to get it whoami
    }, function ( token , done ) {  // This callback is called, if the strategy succeeds
            return done( null , { username: token.username } ); // Token is the payload of the access token we get and confirm its validity
    }
    )
);

router.post('/sign-in' , passport.authenticate( 'sign-in' , {session: false } ) ,function ( req , res) {
        res.json({
                token: jwt.sign( req.user , JWT_SECRET , { expiresIn : 3600 } ) //expires in one hour
        });
});


router.get( '/whoami' ,
    passport.authenticate( 'token' , { session: false } ),
    function ( req , res ) {
            res.json( { user: req.user } );
    }
);

module.exports = router;

