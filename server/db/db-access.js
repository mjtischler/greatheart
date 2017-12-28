'use strict';

const db = this;
const MongoClient = require('mongodb').MongoClient;
// MT: Needed to search by ID. We may move this elsewhere in the future.
const ObjectID = require('mongodb').ObjectID;

const uri = require('./access/connection-string.json');
const databaseName = require('./access/database-name.json');

// MT: `testConnection()` is used exactly as the name implies.
db.testConnection = function () {
  MongoClient.connect(uri, (err, client) => {
    if (err) {
      throw new Error('Database failed to connect!');
    } else {
      console.log('Successfully connected to MongoDB on port 27017.');

      client.close();
    }
  });
};

// MT: `writeToCollection()` is used for writing one or more objects to the database.
// `collectionName` is the document of your database to which you wish to write and must be a STRING.
// `newRecord` can be an OBJECT, or an ARRAY of objects.
// `isInsertingMultiple` is a BOOL and if `items` is an array then it must set to true.
db.writeToCollection = function (collectionName, newRecord, isInsertingMultiple) {
  MongoClient.connect(uri, (err, client) => {
    if (err) {
      throw new Error('Database failed to connect: ', err);
    } else {
      const database = client.db(databaseName);

      if (isInsertingMultiple) {
        database.collection(collectionName).insertMany(newRecord, (insertErr, result) => {
          if (insertErr) {
            throw new Error('Failed to INSERTMANY record into database: ', insertErr);
          } else {
            console.log(`Successfully inserted ${result.insertedCount} records!`);

            client.close();
          }
        });
      } else {
        database.collection(collectionName).insertOne(newRecord, (insertErr, result) => {
          if (insertErr) {
            throw new Error('Failed to INSERTONE record into database: ', insertErr);
          } else {
            console.log(`Successfully inserted ${result.insertedCount} record!`);

            client.close();
          }
        });
      }

      client.close();
    }
  });
};

// MT: `updateCollection()` is used for updating one or more objects in the database.
// `collectionName` is the document of your database to which you wish to write and must be a STRING.
// `query` is STRING key that matches the collection's _id.
// `updatedRecord` must (TODO: can) be an OBJECT (TODO: or an ARRAY of objects).
db.updateCollection = function (collectionName, query, updatedRecord) {
  MongoClient.connect(uri, (err, client) => {
    if (err) {
      throw new Error('Database failed to connect: ', err);
    } else {
      const database = client.db(databaseName);

      database.collection(collectionName).update({_id: ObjectID(query)}, updatedRecord, updateErr => {
        if (updateErr) {
          throw new Error('Failed to UPDATE record into database: ', updateErr);
        } else {
          console.log(`Successfully updated record ${JSON.stringify(query)} with ${JSON.stringify(updatedRecord)} in ${collectionName}`);

          client.close();
        }
      });
    }
  });
};

// MT: `searchCollection()` is used for returning records from a collection based on a query.
// `collectionName` is the document of your database through which you wish to search and must be a STRING.
// `query` is an OBJECT that matches the collection's data structure (i.e. the key/pair for which you're searching). Not passing a 'query' will return the entire collection.
db.searchCollection = function (collectionName, query) {
  let result;

  MongoClient.connect(uri, (err, client) => {
    if (err) {
      throw new Error('Database failed to connect: ', err);
    } else {
      const database = client.db(databaseName);

      database.collection(collectionName).find(query).toArray((findErr, docs) => {
        if (findErr) {
          throw new Error('An error occured while attempting to find a record: ', findErr);
        } else if (!docs.length) {
          console.log('No records found');

          result = 'No records found';
        } else {
          console.log('Found the following records: ', docs);

          result = docs;
        }
      });

      client.close();
    }
  });

  return result;
};

module.exports = db;
