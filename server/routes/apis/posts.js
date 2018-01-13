'use strict';

const express = require('express');
const router = express.Router();
const db = require('../../db/db-access');

// MT: Get posts
router.get('/', (req, res) => {
  db.searchCollection('Posts', null, { postAuthorUserId: 0 }, true)
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
