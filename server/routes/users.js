'use strict';

const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/', (req, res) => {
  res.json([
    {
      id: 1,
      username: 'testuser1'
    },
    {
      id: 2,
      username: 'testuser2'
    }
  ]);
});

module.exports = router;
