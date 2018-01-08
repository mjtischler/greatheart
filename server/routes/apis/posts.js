'use strict';

const express = require('express');
const router = express.Router();
// MT: Commented out until we pull posts from the DB.
// const db = require('../../db/db-access');
// MT: Since we're going to retrieve the user's data via their id that is stored in the cookie, we need this function from mongodb.
// const ObjectID = require('mongodb').ObjectID;

// MT: Get posts
router.get('/', (req, res) => {
  res.json({
    gotPosts: 'OK'
  });
});

module.exports = router;
