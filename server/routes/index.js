'use strict';

const express = require('express');
const router = express.Router();
const path = require('path');

router.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../Public/index.html'));
});

module.exports = router;
