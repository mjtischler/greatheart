'use strict';

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, path.join(__dirname, '../../../Public/posts/images/'));
  },
  filename: function (req, file, callback) {
    crypto.pseudoRandomBytes(16, (err, raw) => {
      callback(null, raw.toString('hex') + path.extname(file.originalname));
    });
  }
});
const upload = multer({ dest: path.join(__dirname, '../../../Public/posts/images/'), storage: storage });
const fs = require('fs');
const ghLogger = require('../../../config/ghLogger');

// MT: Add an image. The `upload.single({{STRING}})` must match the name appended in the client (e.g. `data.append('postImage', this.state.image);`).
router.post('/', upload.single('postImage'), (req, res) => {
  // MT: Delete previously uploaded image if the image is changed. This prevents overfilling disk storage.
  if (req.session.postImage) {
    const file = path.join(__dirname, '../../../Public/posts/images/', req.session.postImage);

    fs.unlink(file, error => {
      if (error) {
        ghLogger.error(`Unable to delete file. message: ${error.toString()}, ip: ${req.connection.remoteAddress}`);
        console.error(error.toString());
      } else {
        ghLogger.info(`${file} deleted, ip: ${req.connection.remoteAddress}`);
      }
    });

    req.session.postImage = null;
  }

  if (req.file.mimetype !== 'image/jpeg') {
    res.json({
      status: 'ERROR',
      message: 'Images must be in JPEG format.'
    });
  } else if (req.file.size > 2600000) {
    res.json({
      status: 'ERROR',
      message: 'Images must be less than 2.5MB in size.'
    });
  } else if (req.file.mimetype === 'image/jpeg' && req.file.size < 2600000) {
    req.session.postImage = req.file.filename;

    res.json({
      status: 'OK',
      message: 'Success!'
    });

    ghLogger.info(`File successfully uploaded! fileName: ${req.file.filename}, ip: ${req.connection.remoteAddress}`);
  } else {
    res.json({
      status: 'ERROR',
      message: 'An unknown error occurred. Dang.'
    });

    ghLogger.error(`Unable to upload file. fileName: ${req.file.filename}, ip: ${req.connection.remoteAddress}`);
  }
});

module.exports = router;
