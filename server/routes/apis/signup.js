'use strict';

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../../db/db-access');

/* POST signup information. */
router.post('/', (req, res) => {
  const signup = {
    email: req.body.signupEmail,
    password: req.body.signupPassword
  };

  if (signup.email &&
    signup.password &&
    typeof signup.email === 'string' &&
    typeof signup.password === 'string' &&
    typeof req.body.signupPasswordReentry === 'string' &&
    signup.password === req.body.signupPasswordReentry) {
    bcrypt.hash(signup.password, 10, (err, hash) => {
      if (err) {
        console.log(err);
      }
      signup.password = hash;
    });
    db.writeToCollection('Users', signup)
      .then(() => {
        res.json({status: 'ok'});
      })
      .catch(reject => {
        console.log(reject.status, reject.result);
      });
  } else {
    res.json(['Invalid signup']);
  }
});

module.exports = router;
