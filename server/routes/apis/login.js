'use strict';

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../../db/db-access');

/* POST login information. */
router.post('/', (req, res) => {
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
            req.session.userId = resolve.result[0]._id;

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
