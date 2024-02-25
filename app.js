process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// const MongoClient = require('mongodb').MongoClient
const mongoose = require('mongoose');
const connectToDb = require('./routes/connection');
const cors  = require('cors');
const bodyParser = require('body-parser');



var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');
var testRouteur = require('./routes/tests');
var employeRouter = require('./routes/employe');
var serviceRouter = require('./routes/service_router');
var clientRouter = require('./routes/client');
var statRouter = require('./routes/statistiques');
var depenseRouter = require('./routes/depense_router');
var offrespecialeRouter = require('./routes/offrespeciale_router');
var compteClientRouter = require('./routes/compteClient');

var app = express();


//Connecte la base connection mongo
connectToDb();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(cors());

app.use('/', indexRouter);

// Ato no ahazoana ny users rehetra
app.use('/users', usersRouter);

//Login
app.use('/login', loginRouter);

//Pour tester des trucs
app.use('/test', testRouteur);

// employe 
app.use('/employes',employeRouter);

// service 
app.use('/services',serviceRouter);

// client 
app.use('/client',clientRouter);

// depense
app.use('/depenses',depenseRouter);

// statistiques 
app.use('/statistiques',statRouter);

// offre speciale
app.use('/offrespeciales',offrespecialeRouter);

// compte
app.use('/compteClient',compteClientRouter);


console.log('http://localhost:3000/')


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  // res.render('error');
});

module.exports = app;
