'use strict';

const express = require('express');
const router = express.Router();
const db = require('../../../db/db-access');
// MT: Since we're going to retrieve the user's data via their id that is stored in the cookie, we need this function from mongodb.
const ObjectID = require('mongodb').ObjectID;

// MT: Add a post
router.post('/', (req, res) => {
  console.log(req);
  const addedPost = {
    postHeaderText: req.body.postHeaderText,
    postBodyText: req.body.postBodyText,
    postAuthorUserId: req.session.userId,
    postCreationDate: new Date().toISOString()
  };

  if (addedPost.postHeaderText &&
    addedPost.postBodyText &&
    typeof addedPost.postHeaderText === 'string' &&
    typeof addedPost.postBodyText === 'string' &&
    addedPost.postHeaderText.length > 1 &&
    addedPost.postBodyText.length > 1) {
    db.searchCollection('Users', {_id: ObjectID(req.session.userId)})
      .then(resolve => {
        if (resolve.result[0].isAdmin) {
          db.writeToCollection('Posts', addedPost)
            .then(() => {
              res.json({
                status: 'OK',
                redirected: 'true'
              });
            })
            .catch(reject => {
              res.json({
                status: 'ERROR',
                message: 'An error occured while adding a post.'
              });
              console.log(reject.status, reject.result);
            });
        } else {
          // MT: If the user is not a valid admin, destroy their session immediately and flag their account.
          req.session.destroy(err => {
            if (err) {
              db.updateCollection('Users', resolve.result[0]._id, { $set: { isFlagged: 'true' }});

              console.log('Non-admin tried to add a post, & an error occurred while destroying user session: ', err);

              return res.json({
                status: 'ERROR',
                redirected: 'true'
              });
            }

            db.updateCollection('Users', resolve.result[0]._id, { $set: { isFlagged: 'true' }});

            console.log('Non-admin tried to add a post. Logging out user: ', resolve.result[0]._id);

            return res.json({
              status: 'ERROR',
              redirected: 'true'
            });
          });
        }
      })
      .catch(reject => {
        res.json(reject);
        console.log(reject.status, reject.result);
      });
  } else {
    res.json({
      status: 'ERROR',
      message: 'You must provide both a header and a body for your post.'
    });
  }

  // res.json({
  //   addedPost: 'OK'
  // });
});

module.exports = router;
