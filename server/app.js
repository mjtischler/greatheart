'use strict';

const express = require('express');
const session = require('express-session');
const db = require('./db/db-access');
const path = require('path');
const favicon = require('serve-favicon');
const fs = require('fs');
const morgan = require('morgan');
const ghLogger = require('./config/ghLogger');
const bodyParser = require('body-parser');
const posts = require('./routes/apis/posts');
const user = require('./routes/apis/user');
const login = require('./routes/apis/login');
const logout = require('./routes/apis/logout');
const signup = require('./routes/apis/signup');
const addPost = require('./routes/apis/admin/addPost');
const addImage = require('./routes/apis/admin/addImage');
const index = require('./routes/index');
const uuidv1 = require('uuid/v1');
// MT: The path to our secret key for cookie session storage.
const secretKey = require('./cookies/secret-key.json');
const app = express();

app.use(express.static(path.join(__dirname, './Public')));

app.use(favicon(path.join(__dirname, './Public', './favicon.ico')));

// MT: Test our database connection on load
db.testConnection();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// MT: Set up request logs
const logDirectory = path.join(__dirname, 'logs');
// MT: Check for log directory; if it doesn't exist, make it.
if (!fs.existsSync(logDirectory)) {
  console.log('Creating log directory.');
  fs.mkdirSync(logDirectory);
}
app.use(morgan('combined', { stream: ghLogger.stream }));

const expiryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
const userSession = {
  genid: () => uuidv1(),
  secret: secretKey,
  duration: 30 * 60 * 1000,
  saveUninitialized: true,
  resave: false,
  cookie: {
    httpOnly: false,
    secure: false,
    maxAge: expiryDate
  }
};

if (app.get('env') === 'production') {
  app.set('trust proxy', 1); // trust first proxy
  userSession.cookie.secure = true; // serve secure cookies
}

app.use(session(userSession));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded(
  { extended: false }
));

// MT: Define routes here. Routes must be defined after the bodyParser so that we can correctly pass json data from a client-side fetch request.
app.use('/api/posts', posts);
app.use('/api/user', user);
app.use('/api/login', login);
app.use('/api/logout', logout);
app.use('/api/signup', signup);
app.use('/api/admin/addPost', addPost);
app.use('/api/admin/addImage', addImage);
// MT: react-router will handle routing on the front-end, so we'll deliver the app files on all non-API requests.
// The ordering of the server-side routes matter, hence why the APIs are defined above the wildcard ('*') routing.
app.use('*', index);

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

  // MT: Set up error logger
  ghLogger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
