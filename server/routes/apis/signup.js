'use strict';

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../../db/db-access');

/* POST signup information. */
router.post('/', (req, res) => {
  const signup = {
    email: req.body.signupEmail,
    userName: req.body.signupUsername,
    password: req.body.signupPassword
  };

  if (signup.email &&
    signup.password &&
    signup.userName &&
    typeof signup.email === 'string' &&
    typeof signup.userName === 'string' &&
    typeof signup.password === 'string' &&
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
            req.session.userId = resolve._id;
            res.json({
              status: 'OK',
              redirected: 'true'
            });
          })
          .catch(reject => {
            res.json({
              status: 'ERROR',
              message: 'An error occured while adding a user.'
            });
            console.log(reject.status, reject.result);
          });
      });
    });
  } else {
    res.json({
      status: 'ERROR',
      message: 'All fields must be filled out and the passwords must match.'
    });
  }
});

module.exports = router;
