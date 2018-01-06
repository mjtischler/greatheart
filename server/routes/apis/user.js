'use strict';

const express = require('express');
const router = express.Router();
const db = require('../../db/db-access');
// MT: Since we're going to retrieve the user's data via their id that is stored in the cookie, we need this function from mongodb.
const ObjectID = require('mongodb').ObjectID;

// MT: Get logged in user data
router.get('/', (req, res) => {
  db.searchCollection('Users', {_id: ObjectID(req.session.userId)})
    .then(resolve => {
      // MT: Commenting out for now, but may be useful in the future.
      // console.log(req.session.userId, req.sessionID);

      res.json({
        status: 'OK',
        result: {
          userId: resolve.result[0]._id,
          userName: resolve.result[0].userName,
          email: resolve.result[0].email
        }
      });
    })
    .catch(reject => {
      res.json(reject);
      console.log(reject.status, reject.result);
    });
});

module.exports = router;
