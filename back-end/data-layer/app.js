//const createError = require( 'http-errors' );
const express = require( 'express' );
const cookieParser = require( 'cookie-parser' );
const logger = require( 'morgan' );
const authRouter = require( './routes/authenticate' );
const addUserRouter = require( './routes/add-user' );
const questionRouter = require('./routes/questioning')
const cors = require('cors')

let app = express();
app.use(cors())
app.use( logger('dev') );
app.use( express.json() );
app.use( express.urlencoded( { extended: false } ) );
app.use( cookieParser() );

//import routers
app.use( '/' , authRouter );
app.use( '/add_user' , addUserRouter );
app.use( '/' , questionRouter );

const PORT = 5002;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
// catch 404 and forward to error handler
// catch 404 and forward to error handler



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