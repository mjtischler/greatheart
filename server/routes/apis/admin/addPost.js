'use strict';

const express = require('express');
const router = express.Router();
const db = require('../../../db/db-access');
// MT: Since we're going to retrieve the user's data via their id that is stored in the cookie, we need this function from mongodb.
const ObjectID = require('mongodb').ObjectID;
const ghLogger = require('../../../config/ghLogger');

// MT: Add a post
router.post('/', (req, res) => {
  const addedPost = {
    postHeaderText: req.body.postHeaderText,
    postBodyText: req.body.postBodyText,
    postAuthorUserId: req.session.userId,
    postAuthorName: req.session.userName,
    postImage: req.session.postImage,
    postCreationDate: new Date().toISOString()
  };

  if (addedPost.postHeaderText &&
    addedPost.postBodyText &&
    addedPost.postAuthorUserId &&
    addedPost.postAuthorName &&
    addedPost.postCreationDate &&
    typeof addedPost.postHeaderText === 'string' &&
    typeof addedPost.postBodyText === 'string' &&
    typeof addedPost.postAuthorUserId === 'string' &&
    typeof addedPost.postAuthorName === 'string' &&
    typeof addedPost.postCreationDate === 'string' &&
    addedPost.postHeaderText.length > 1 &&
    addedPost.postBodyText.length > 1) {
    db.searchCollection('Users', {_id: ObjectID(req.session.userId)})
      .then(resolve => {
        if (resolve.result[0].isAdmin) {
          db.writeToCollection('Posts', addedPost)
            .then(() => {
              // MT: Reset the postImage once we've written it to the collection.
              if (req.session.postImage) {
                req.session.postImage = null;
              }

              res.json({
                status: 'OK',
                redirected: 'true'
              });

              ghLogger.info(`Post added successfully! id: ${addedPost.postAuthorUserId}, ip: ${req.connection.remoteAddress}`);
            })
            .catch(reject => {
              res.json({
                status: 'ERROR',
                message: 'An error occured while adding a post.'
              });

              ghLogger.error(`Failed to add post. status: ${reject.status}, result: ${reject.result}, id: ${addedPost.postAuthorUserId}, ip: ${req.connection.remoteAddress}`);
            });
        } else {
          // MT: If the user is not a valid admin, destroy their session immediately and flag their account.
          req.session.destroy(err => {
            if (err) {
              db.updateCollection('Users', resolve.result[0]._id, { $set: { isFlagged: 'true' }});

              ghLogger.error(`Non-admin tried to add a post, & an error occurred while destroying user's session. result: ${err}, id: ${resolve.result[0]._id}, ip: ${req.connection.remoteAddress}`);

              return res.json({
                status: 'ERROR',
                redirected: 'true'
              });
            }

            db.updateCollection('Users', resolve.result[0]._id, { $set: { isFlagged: 'true' }});

            ghLogger.error(`Non-admin tried to add a post, logging out user. result: ${err}, id: ${resolve.result[0]._id}, ip: ${req.connection.remoteAddress}`);

            return res.json({
              status: 'ERROR',
              redirected: 'true'
            });
          });
        }
      })
      .catch(reject => {
        res.json(reject);

        ghLogger.error(`Error adding post. status: ${reject.status}, result: ${reject.result}, id: ${addedPost.postAuthorUserId}, ip: ${req.connection.remoteAddress}`);
      });
  } else {
    res.json({
      status: 'ERROR',
      message: 'You must provide both a header and a body for your post.'
    });
  }
});

module.exports = router;
