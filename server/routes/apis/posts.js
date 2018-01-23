'use strict';

const express = require('express');
const router = express.Router();
const db = require('../../db/db-access');

// MT: Get posts
router.get('/', (req, res) => {
  // MT: Let's pass in the collectionName, a null query object, the field to remove, and the sort order (newest first).
  db.searchCollection('Posts', null, { fields: { postAuthorUserId: 0 }}, { postCreationDate: -1 })
    .then(resolve => {
      res.json({
        status: 'OK',
        posts: resolve.result
      });
    })
    .catch(reject => {
      console.log('Error retrieving posts: ', reject);

      res.json({
        status: 'ERROR',
        result: 'There was an error retrieving the posts.'
      });
    });
});

module.exports = router;
