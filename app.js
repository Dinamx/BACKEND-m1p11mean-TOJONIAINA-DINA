process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// const MongoClient = require('mongodb').MongoClient
const mongoose = require('mongoose');
const connectToDb = require('./routes/connection');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');



var app = express();


connectToDb();

// mongoose.connect('mongodb+srv://poseidon:poseidon@poseidon.jpmfmcc.mongodb.net/?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true})


// const mongoString = 'mongodb+srv://poseidon:poseidon@poseidon.jpmfmcc.mongodb.net/?retryWrites=true&w=majority';
//
// MongoClient.connect(mongoString).then(
//     client => {
//       console.log('Connected to Database')
//         let db = client.db('poseidon')
//       // quotesCollection = db.collection('quotes')
//     }
// )
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
//Login

app.use('/login', loginRouter);
app.use('/signup', loginRouter);




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
