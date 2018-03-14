'use strict';

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../../db/db-access');
const ghLogger = require('../../config/ghLogger');

// MT: To Do- Create a reusable validation function.

/* POST signup information. */
router.post('/', (req, res) => {
  const signup = {
    email: req.body.signupEmail,
    userName: req.body.signupUsername,
    password: req.body.signupPassword,
    sessionID: req.sessionID,
    lastLogin: new Date().toISOString(),
    numberOfLogins: 1
  };

  if (signup.email &&
    signup.userName &&
    signup.password &&
    signup.sessionID &&
    signup.lastLogin &&
    signup.numberOfLogins === 1 &&
    typeof signup.email === 'string' &&
    typeof signup.userName === 'string' &&
    typeof signup.password === 'string' &&
    typeof signup.sessionID === 'string' &&
    typeof signup.lastLogin === 'string' &&
    signup.password.length > 5 &&
    typeof req.body.signupPasswordReentry === 'string' &&
    signup.password === req.body.signupPasswordReentry) {
    // MT: Check the database for an existing email and userName
    db.searchCollection('Users', {email: signup.email})
    .then(() => {
      // MT: In this case, a resolve means that we've found a record and we need to return an error to the front end.
      res.json({
        status: 'ERROR',
        message: 'Email address already exists.'
      });
    }).catch(() => {
      // MT: We received a rejection because no records matched the submitted email address. Now, let's check for the userName.
      db.searchCollection('Users', {userName: signup.userName})
      .then(() => {
        res.json({
          status: 'ERROR',
          message: 'Username has been taken.'
        });
      }).catch(() => {
        // MT: Both the email and the userName are unique, and we can move on to hashing the password and adding the user to the db.
        bcrypt.hash(signup.password, 10, (err, hash) => {
          if (err) {
            console.log(err);
          }
          signup.password = hash;
        });
        db.writeToCollection('Users', signup)
          .then(resolve => {
            // MT: Store the userId in the session and pass it to the front-end.
            req.session.userId = resolve._id;
            req.session.save();

            res.json({
              status: 'OK',
              redirected: 'true'
            });

            ghLogger.info(`New user added! status: ${resolve.status}, result: ${resolve.result}, id: ${resolve._id}, userName: ${signup.userName}, ip: ${req.connection.remoteAddress}`);
          })
          .catch(reject => {
            res.json({
              status: 'ERROR',
              message: 'An error occured while adding a user.'
            });

            ghLogger.error(`Failure to add user. status: ${reject.status}, result: ${reject.result}, ip: ${req.connection.remoteAddress}`);
          });
      });
    });
  } else {
    res.json({
      status: 'ERROR',
      message: 'All fields must be filled out, and the passwords must match and contain at least 6 characters.'
    });
  }
});

module.exports = router;
