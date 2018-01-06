// MT: This module contains several functions to help our APIs perform operations against the database.
// C: `writeToCollection()`
// R: `searchCollection()`
// U: `updateCollection()`
// D: `removeFromCollection()`
'use strict';

const db = this;
const MongoClient = require('mongodb').MongoClient;
// MT: Needed to search by ID. We may move this elsewhere in the future.
const ObjectID = require('mongodb').ObjectID;

const uri = require('./access/connection-string.json');
const databaseName = require('./access/database-name.json');

// MT: Our response object that gets returned with every database operation.
db.response = {
  status: null,
  result: null
};

// MT: `testConnection()` is used exactly as the name implies.
db.testConnection = function () {
  const successMessage = 'Successfully connected to MongoDB on port 27017.';

  MongoClient.connect(uri, (err, client) => {
    if (err) {
      throw new Error('Database failed to connect!');
    } else {
      console.log(successMessage);

      client.close();
    }
  });

  db.response.status = 'OK';
  db.response.result = successMessage;

  return db.response;
};

// MT: `writeToCollection()` is used for writing one or more objects to the database.
// `collectionName` is the document of your database to which you wish to write and must be a STRING (REQUIRED).
// `newRecord` can be an OBJECT, or an ARRAY of objects (REQUIRED).
// `isInsertingMultiple` is a BOOL and if `newRecord` is an array then it must set to true.
db.writeToCollection = function (collectionName, newRecord, isInsertingMultiple) {
  return new Promise((resolve, reject) => {
    if (!collectionName || !newRecord) {
      db.response.status = 'ERROR';
      db.response.result = 'writeToCollection(): collectionName and/or newRecord must be defined.';

      reject(db.response);
    } else {
      MongoClient.connect(uri, (err, client) => {
        if (err) {
          throw new Error('Database failed to connect: ', err);
        } else {
          const database = client.db(databaseName);
          let message;

          if (isInsertingMultiple) {
            database.collection(collectionName).insertMany(newRecord, (insertErr, result) => {
              if (insertErr) {
                throw new Error('Failed to INSERTMANY record into database: ', insertErr);
              } else {
                message = `Successfully inserted ${result.insertedCount} records!`;
                console.log(message);

                db.response.status = 'OK';
                db.response.result = message;

                resolve(db.response);
              }
            });
          } else {
            database.collection(collectionName).insertOne(newRecord, (insertErr, result) => {
              if (insertErr) {
                throw new Error('Failed to INSERTONE record into database: ', insertErr);
              } else {
                message = `Successfully inserted ${result.insertedCount} record!`;
                console.log(message);

                db.response.status = 'OK';
                db.response.result = message;
                db.response._id = result.ops[0]._id;

                resolve(db.response);
              }
            });
          }

          client.close();
        }
      });
    }
  });
};

// MT: `searchCollection()` is used for returning records from a collection based on a query.
// `collectionName` is the document of your database through which you wish to search and must be a STRING (REQUIRED).
// `query` is an OBJECT that matches the collection's data structure (i.e. the key/pair for which you're searching). Not passing a `query` will return the entire collection.
db.searchCollection = function (collectionName, query) {
  return new Promise((resolve, reject) => {
    if (!collectionName) {
      db.response.status = 'ERROR';
      db.response.result = 'searchCollection(): collectionName must be defined.';

      reject(db.response);
    } else {
      MongoClient.connect(uri, (err, client) => {
        if (err) {
          throw new Error('Database failed to connect: ', err);
        } else {
          const database = client.db(databaseName);
          let message;

          database.collection(collectionName).find(query).toArray((findErr, docs) => {
            if (findErr) {
              throw new Error('An error occured while attempting to find a record: ', findErr);
            } else if (!docs.length) {
              message = 'No records found';
              console.log(message);

              db.response.status = 'ERROR';
              db.response.result = message;

              reject(db.response);
            } else {
              message = `Found ${docs.length} matching records.`;
              console.log(message);

              db.response.status = 'OK';
              db.response.result = docs;

              resolve(db.response);
            }
          });

          client.close();
        }
      });
    }
  });
};

// MT: `updateCollection()` is used for updating one or more objects in the database.
// `collectionName` is the document of your database to which you wish to write and must be a STRING (REQUIRED).
// `recordID` is STRING key that matches the document's _id (REQUIRED).
// `updatedRecord` must (TODO: can) be an OBJECT (TODO: or an ARRAY of objects) (REQUIRED).
// If you need to add a field to a record, use: `db.updateCollection(collectionName, recordID, { $set: { new_key: 'new_value' }});`
db.updateCollection = function (collectionName, recordID, updatedRecord) {
  return new Promise((resolve, reject) => {
    if (!collectionName || !recordID || !updatedRecord) {
      db.response.status = 'ERROR';
      db.response.result = 'updateCollection(): collectionName, recordID, and/or updatedRecord must be defined.';

      reject(db.response);
    } else {
      MongoClient.connect(uri, (err, client) => {
        if (err) {
          throw new Error('Database failed to connect: ', err);
        } else {
          let message;
          const database = client.db(databaseName);

          database.collection(collectionName).update({_id: ObjectID(recordID)}, updatedRecord, updateErr => {
            if (updateErr) {
              throw new Error('Failed to UPDATE record into database: ', updateErr);
            } else {
              message = `Successfully updated record ${JSON.stringify(recordID)} with ${JSON.stringify(updatedRecord)} in ${collectionName}`;

              console.log(message);

              db.response.status = 'OK';
              db.response.result = message;

              resolve(db.response);
            }
          });

          client.close();
        }
      });
    }
  });
};

// MT: `removeFromCollection()` is used for removing one or more objects from the database.
// `collectionName` is the document of your database to which you wish to write and must be a STRING (REQUIRED).
// `recordID` is STRING key that matches the document's _id (REQUIRED).
db.removeFromCollection = function (collectionName, recordID) {
  return new Promise((resolve, reject) => {
    if (!collectionName || !recordID) {
      db.response.status = 'ERROR';
      db.response.result = 'removeFromCollection(): collectionName and/or recordID must be defined.';

      reject(db.response);
    } else {
      MongoClient.connect(uri, (err, client) => {
        if (err) {
          throw new Error('Database failed to connect: ', err);
        } else {
          let message;
          const database = client.db(databaseName);

          database.collection(collectionName).deleteOne({_id: ObjectID(recordID)}, (deleteErr, result) => {
            if (deleteErr) {
              throw new Error('Failed to DELETEONE record from database: ', deleteErr);
            } else if (result.deletedCount < 1) {
              message = `No records were found with an ID of ${recordID} so none were removed.`;

              console.log(message);

              db.response.status = 'OK';
              db.response.result = message;

              resolve(db.response);
            } else {
              message = `Successfully removed ${result.deletedCount} record!`;

              console.log(message);

              db.response.status = 'OK';
              db.response.result = message;

              resolve(db.response);
            }
          });

          client.close();
        }
      });
    }
  });
};

module.exports = db;
