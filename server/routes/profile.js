'use strict';

const express = require('express');
const router = express.Router();
const db = require('../db/db-access');

/* GET users listing. */
router.get('/', (req, res) => {
  db.searchCollection('test')
    .then(resolve => {
      res.json([resolve.result]);
    })
    .catch(reject => {
      console.log(reject.status, reject.result);
    });
});

module.exports = router;
