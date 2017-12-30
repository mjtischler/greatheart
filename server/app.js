'use strict';

const express = require('express');
const db = require('./db/db-access');
// MT: Needed to search by ID. We may move this elsewhere in the future.
// const ObjectID = require('mongodb').ObjectID;
const path = require('path');
// MT: Uncomment when you have a favicon ready to serve.
// const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');

const index = require('./routes/index');
const users = require('./routes/users');
const login = require('./routes/apis/login');
const signup = require('./routes/apis/signup');
const profile = require('./routes/profile');

const app = express();

// MT: Test our database connection on load
db.testConnection();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false
}));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded(
  { extended: false }
));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/api/login', login);
app.use('/api/signup', signup);
app.use('/profile', profile);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
