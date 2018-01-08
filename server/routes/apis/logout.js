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
      // MT: Set the user's sessionID to null in the DB.
      db.updateCollection('Users', resolve.result[0]._id, { $set: { sessionID: null }});
      if (req.session) {
        req.session.destroy(err => {
          if (err) {
            console.log('Error occurred while destroying user session: ', err);

            return res.json({
              status: 'ERROR',
              redirected: 'true'
            });
          }

          console.log('Logging out user: ', resolve.result[0]._id);
          return res.json({
            status: 'OK',
            redirected: 'true'
          });
        });
      } else {
        console.log('Session not found, redirecting client anyways.');

        return res.json({
          status: 'ERROR',
          redirected: 'true'
        });
      }
    })
    .catch(reject => {
      res.json(reject);
      console.log(reject.status, reject.result);
    });
});

module.exports = router;
