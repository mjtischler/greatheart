'use strict';

const express = require('express');
const router = express.Router();
const db = require('../../../db/db-access');
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const mime = require('mime-types');
const upload = multer({ dest: path.join(__dirname, '../../../Public/posts/images/'), limits: { fieldSize: 25 * 1024 * 1024 }});
const fs = require('fs');
const ghLogger = require('../../../config/ghLogger');
const ghClamscan = require('../../../config/ghClamscan');

const getFilesizeInBytes = sessionImage => {
  const stats = fs.statSync(sessionImage);
  const fileSizeInBytes = stats.size;

  return fileSizeInBytes;
};

const deleteExistingFile = req => new Promise((resolve, reject) => {
  const file = path.join(__dirname, '../../../Public/posts/images/', req.session.postImage);

  fs.unlink(file, error => {
    if (error) {
      reject(`Unable to delete file. message: ${error.toString()}, ip: ${req.connection.remoteAddress}`);
    } else {
      req.session.postImage = null;
      req.session.save();

      resolve(`Deleted: ${file}, ip: ${req.connection.remoteAddress}`);
    }
  });
});

const uploadFile = req => new Promise((resolve, reject) => {
  // strip off the data: url prefix to get just the base64-encoded bytes
  const imageString = req.body.postImage.replace(/^data:image\/[jpeg]+;base64,/, '');
  const imageBuffer = Buffer.from(imageString, 'base64');
  const randomFileNameData = crypto.randomBytes(16);
  const imageFileName = `${randomFileNameData.toString('hex')}.jpg`;

  fs.writeFile(path.join(__dirname, `../../../Public/posts/images/${imageFileName}`), imageBuffer, error => {
    if (error) {
      ghLogger.error(`${error} occured while writing file ${imageFileName}, ip: ${req.connection.remoteAddress}`);

      reject({
        status: 'ERROR',
        message: `${error} occured while writing file ${imageFileName}, ip: ${req.connection.remoteAddress}`
      });
    }

    req.session.postImage = imageFileName;
    req.session.save();

    // MT: Set the session image for use throughout the rest of the service.
    const sessionImage = path.join(__dirname, '../../../Public/posts/images/', req.session.postImage);

    ghLogger.info(`File successfully saved! ${imageFileName}, ip: ${req.connection.remoteAddress}`);

    resolve(sessionImage);
  });
});

const sanitizeFile = (req, sessionImage) => new Promise((resolve, reject) => {
  if (mime.lookup(sessionImage) !== 'image/jpeg') {
    deleteExistingFile(req).then(deleteResult => {
      ghLogger.info(deleteResult);

      reject({
        status: 'ERROR',
        message: 'Image must be in JPG format.'
      });
    }, deleteError => {
      ghLogger.info(deleteError);

      reject({
        status: 'ERROR',
        message: 'Image must be in JPG format.'
      });
    });
  } else if (getFilesizeInBytes(sessionImage) > 150000) {
    deleteExistingFile(req).then(deleteResult => {
      ghLogger.info(deleteResult);

      reject({
        status: 'ERROR',
        message: 'Image must be less than 150KB in size.'
      });
    }, deleteError => {
      ghLogger.info(deleteError);

      reject({
        status: 'ERROR',
        message: 'Image must be less than 150KB in size.'
      });
    });
  } else {
    ghClamscan.is_infected(sessionImage, (error, fileName, is_infected) => {
      if (error) {
        ghLogger.error(`Clamscan error from ${req.session.userName}! error: ${error} fileName: ${fileName}, ip: ${req.connection.remoteAddress}`);

        reject({
          status: 'ERROR',
          message: 'There was an error uploading your file.',
          redirected: true
        });
      } else if (is_infected) {
        db.updateCollection('Users', req.session.userId, { $set: { isFlagged: 'true' }});

        ghLogger.error(`Clamscan detected an infected file from user ${req.session.userName}! fileName: ${sessionImage}, ip: ${req.connection.remoteAddress}`);

        if (req.session) {
          req.session.destroy(sessionErr => {
            if (sessionErr) {
              ghLogger.error(`Infected file upload attempted. Failed to destroy user session. message: ${sessionErr}, ip: ${req.connection.remoteAddress}`);
            } else {
              ghLogger.error(`Infected file upload attempted. Destroying user session! ip: ${req.connection.remoteAddress}`);
            }
          });
        }

        reject({
          status: 'ERROR',
          message: 'There was an error uploading your file.',
          redirected: true
        });
      } else {
        resolve({
          status: 'OK',
          message: 'Your file was successfully uploaded!',
          fileLocation: `/posts/images/${req.session.postImage}`
        });
      }
    });
  }
});

// MT: Add an image. The `upload.single({{STRING}})` must match the name appended in the client (e.g. `data.append('postImage', this.state.image);`).
router.post('/', upload.single('postImage'), (req, res) => {
  if (req.session.isAdmin === 'true') {
    // MT: Delete previously uploaded image if the image is changed. This prevents overfilling disk storage.
    if (req.session.postImage) {
      deleteExistingFile(req).then(deleteResult => {
        ghLogger.info(deleteResult);

        uploadFile(req).then(uploadResult => {
          sanitizeFile(req, uploadResult).then(sanitizeResult => {
            res.json(sanitizeResult);
          }, sanitizeError => {
            res.json(sanitizeError);
          });
        }, uploadError => {
          res.json(uploadError);
        });
      }, deleteError => {
        // MT: Trigger an innocuous error when the file doesn't exist, then upload the file anyways.
        ghLogger.error(deleteError);

        uploadFile(req).then(uploadResult => {
          sanitizeFile(req, uploadResult).then(sanitizeResult => {
            res.json(sanitizeResult);
          }, sanitizeError => {
            res.json(sanitizeError);
          });
        }, uploadError => {
          res.json(uploadError);
        });
      });
    } else {
      uploadFile(req).then(uploadResult => {
        sanitizeFile(req, uploadResult).then(sanitizeResult => {
          res.json(sanitizeResult);
        }, sanitizeError => {
          res.json(sanitizeError);
        });
      }, uploadError => {
        res.json(uploadError);
      });
    }
  } else {
    ghLogger.error(`Non-admin attempted file upload. userName: ${req.session.userName}, ip: ${req.connection.remoteAddress}`);

    if (req.session.postImage) {
      deleteExistingFile(req).then(deleteResult => {
        ghLogger.info(deleteResult);
      }, deleteError => {
        ghLogger.error(deleteError);
      });
    }

    db.updateCollection('Users', req.session.userId, { $set: { isFlagged: 'true' }}).then(resolve => {
      ghLogger.info(resolve.result);
    }, reject => {
      ghLogger.error(reject.result);
    });

    if (req.session) {
      req.session.destroy(err => {
        if (err) {
          ghLogger.error(`Non-admin attempted file upload. Failed to destroy user session. message: ${err}, ip: ${req.connection.remoteAddress}`);

          res.json({
            status: 'ERROR',
            message: 'You are not permitted to upload images. Your IP address has been logged and your account has been disabled.',
            redirected: 'true'
          });
        } else {
          ghLogger.info(`Non-admin attempted file upload. Destroying user session! ip: ${req.connection.remoteAddress}`);

          res.json({
            status: 'ERROR',
            message: 'You are not permitted to upload images. Your IP address has been logged and your account has been disabled.',
            redirected: 'true'
          });
        }
      });
    } else {
      res.json({
        status: 'ERROR',
        message: 'You are not permitted to upload images. Your IP address has been logged and your account has been disabled.',
        redirected: 'true'
      });
    }
  }
});

module.exports = router;
