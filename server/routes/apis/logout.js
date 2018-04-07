'use strict';

const express = require('express');
const router = express.Router();
const db = require('../../db/db-access');
// MT: Since we're going to retrieve the user's data via their id that is stored in the cookie, we need this function from mongodb.
const ObjectID = require('mongodb').ObjectID;
const ghLogger = require('../../config/ghLogger');

// MT: Get logged in user data
router.get('/', (req, res) => {
  db.searchCollection('Users', {_id: ObjectID(req.session.userId)})
    .then(resolve => {
      // MT: Set the user's sessionID to null in the DB.
      db.updateCollection('Users', resolve.result[0]._id, { $set: { sessionID: null }});
      if (req.session) {
        req.session.destroy(err => {
          if (err) {
            ghLogger.error(`Failed to destroy user session. message: ${err}, ip: ${req.connection.remoteAddress}`);

            return res.json({
              status: 'ERROR',
              redirected: 'true'
            });
          }

          ghLogger.info(`Logging out user! id: ${resolve.result[0]._id}, ip: ${req.connection.remoteAddress}`);

          return res.json({
            status: 'OK',
            redirected: 'true'
          });
        });
      } else {
        ghLogger.error(`Session not found, redirecting client anyways. ip: ${req.connection.remoteAddress}`);

        return res.json({
          status: 'ERROR',
          redirected: 'true'
        });
      }

      return false;
    })
    .catch(reject => {
      res.json(reject);

      ghLogger.error(`Unknown logout failure. Logging out user. status: ${reject.status}, message: ${reject.result}, ip: ${req.connection.remoteAddress}`);
    });
});

module.exports = router;
