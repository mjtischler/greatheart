'use strict';

const express = require('express');
const router = express.Router();
const db = require('../../db/db-access');
const ghLogger = require('../../config/ghLogger');

// MT: Get posts
router.post('/', (req, res) => {
  // MT: Let's pass in the collectionName, a null query object, the field to remove, the sort order (newest first), and the number
  // of posts to return.
  db.searchCollection('Posts', null, { fields: { postAuthorUserId: 0 }}, { postCreationDate: -1 }, req.body.postReturnLimit)
    .then(resolve => {
      res.json({
        status: 'OK',
        posts: resolve.result
      });

      ghLogger.info(`Retrieved posts! status: ${resolve.status}, numberOfPosts: ${resolve.result.length}, ip: ${req.connection.remoteAddress}`);
    })
    .catch(reject => {
      res.json({
        status: 'ERROR',
        result: 'There was an error retrieving the posts.'
      });

      ghLogger.error(`There was a problem retrieving posts. result: ${reject.result}, ip: ${req.connection.remoteAddress}`);
    });
});

module.exports = router;
