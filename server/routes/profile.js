'use strict';

const express = require('express');
const router = express.Router();
const path = require('path');

router.use(express.static(path.join(__dirname, '../../client/build')));

router.get('/profile', (req, res) => {
  // MT: We pass the redirected flag to the react-router on a successful login in the login and signup APIs, but we need the server route to match the client route so we can maintain a session and send the appropriate data back and forth.
  res.sendFile(path.join(__dirname, '../../client/build/index.html', () => {
    console.log('req');
  }));
});

module.exports = router;
