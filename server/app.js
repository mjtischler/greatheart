'use strict';

// MT: Let's create out gitignore'd directory structure. For the first run, remember to add the appropriate files to
// `db/access` and `cookies`, and to execute `npm run build` from the client directory after the initial failure.
const appStructure = require('./config/appStructure');
appStructure.createDirectories(__dirname);

const express = require('express');
const helmet = require('helmet');
const session = require('express-session');
const db = require('./db/db-access');
const path = require('path');
const favicon = require('serve-favicon');
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
// MT: Use `helmet` to set specialized HTTP headers to protect the app. Also spoofs client into thinking the app is served by PHP.
// We will only see the appropriate headers on a deployed app, and not from the webpack dev instance.
app.use(
  helmet(),
  helmet.hsts({
    maxAge: 5184000
  }),
  helmet.hidePoweredBy({ setTo: 'PHP/7.2.4' })
);

const redis = require('redis');
const client = redis.createClient();
const RedisStore = require('connect-redis')(session);

app.use(express.static(path.join(__dirname, './Public')));
app.use(favicon(path.join(__dirname, './Public', './favicon.ico')));

// MT: Test our database connection on load
db.testConnection();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(morgan('combined', { stream: ghLogger.stream }));

// MT: Since the implementation of the cluster, we need to use redis stores to maintain client sessions.
const expiryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
const userSession = {
  store: new RedisStore({
    port: 6379,
    host: 'localhost',
    client: client
  }),
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
