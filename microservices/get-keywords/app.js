//const createError = require( 'http-errors' );
const express = require( 'express' );
const cookieParser = require( 'cookie-parser' );
const logger = require( 'morgan' );
const cors = require('cors')

let app = express();
app.use(cors())
app.use( logger('dev') );
app.use( express.json() );
app.use( express.urlencoded( { extended: false } ) );
app.use( cookieParser() );

//import routers


const PORT = 5003;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
// catch 404 and forward to error handler
// catch 404 and forward to error handler

//Redis Connection

const REDIS_PORT = 6379;
const REDIS_HOST = 'localhost';
const TotalConnections = 20;
const pool = require('redis-connection-pool')('myRedisPool', {
  host: REDIS_HOST,
  port: REDIS_PORT,
  max_clients: TotalConnections,
  perform_checks: false,
  database: 0
});

pool.hget('subscribers','create-question' , async ( error , data ) => {
  let currentSubscribers = JSON.parse( data );
  let alreadySubscribed = false;
  let myAddress = 'http://localhost:5003/update_keywords'
  for( let i = 0; i < currentSubscribers.length; i++ ) {
    if( currentSubscribers[i] == myAddress ) {
      alreadySubscribed = true;
    }
  }
  if( alreadySubscribed == false ) {
   currentSubscribers.push( myAddress );
   pool.hset( 'subscribers' , 'create-question' , JSON.stringify(currentSubscribers),() => {});
   console.log('subscribed');
  }
  else {
    console.log('already subscribed')
  }

} )

app.use( ( req, res , next ) => {
  next(createError(404));
});

app.use(  ( err, req , res , next ) => {
  const status = err.status || 500;
  if( status >= 500 || req.app.get( 'env' ) === 'development' ) {
    console.log( err.stack );
  }
  next( err );
} );

// error handler
app.use( (err, req, res, next ) => {
  const status = err.status || 500;
  res.status( status );
  //In case of an internal error(status >=500) we don't want to send this error to the user
  const message = ( status >= 500 ) ? "internal error" : err.message;
  //In case of development mode see exactly where is the problem that created the internal error
  const expose = ( status >= 500 ) && req.app.get( 'env' ) === 'development';
  res.end( expose ? message + '\n\n' + err.stack : message );

  //Json sets content-type header. This is also the difference between 'end' and 'send'
  //'res.send()' includes also the content-type, except from a simple string
});




module.exports = app;