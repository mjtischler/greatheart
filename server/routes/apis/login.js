'use strict';

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../../db/db-access');

/* POST login information. */
router.post('/', (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  const login = {
    email: req.body.loginEmail,
    password: req.body.loginPassword
  };

  if (login.email &&
    login.password &&
    typeof login.email === 'string' &&
    typeof login.password === 'string') {
    db.searchCollection('Users', {email: login.email})
      .then(resolve => {
        bcrypt.compare(login.password, resolve.result[0].password, (err, result) => {
          if (result === true) {
            // MT: Check to see if user is flagged in the system because of potential breach attempts.
            if (resolve.result[0].isFlagged === 'true') {
              return res.json({
                status: 'ERROR',
                message: 'Your account has been disabled. Please contact admin@greatheart.com for further information.'
              });
            }
            // MT: Set admin flag.
            if (resolve.result[0].isAdmin === 'true') {
              req.session.isAdmin = resolve.result[0].isAdmin;
            } else {
              req.session.isAdmin = 'false';
            }
            // MT: Store the userId in the session and pass it to the front-end.
            req.session.userId = resolve.result[0]._id;
            // MT: Save the sessionID to the user's record in the database, set the login time, and increase the number of logins.
            // TO DO: Resolve the promise with .then() and .catch().
            db.updateCollection('Users', resolve.result[0]._id, {
              $set: {
                sessionID: req.sessionID,
                lastLogin: new Date().toISOString()
              },
              $inc: {
                numberOfLogins: 1
              }
            });
            req.session.save();

            return res.json({
              status: 'OK',
              redirected: 'true'
            });
          }

          // MT: If the passwords don't match, return an error object.
          return res.json({
            status: 'ERROR',
            message: 'Password is incorrect.'
          });
        });
      })
      .catch(() => {
        res.json({
          status: 'ERROR',
          message: 'Email address not found.'
        });
      });
  } else {
    res.json({
      status: 'ERROR',
      message: 'Login is invalid.'
    });
  }
});

module.exports = router;
