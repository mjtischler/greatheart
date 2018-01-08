# Greatheart
A webapp template utilizing MongoDB, Express, React, and Node.js, and a _work in progress_. Enjoy!

## Table of Contents

- [To Do](#to-do)
- [Me](#me)
- [You](#you)
- [Getting Started](#getting-started)
- [Firing up the Application](#firing-up-the-application)
  * [Express Server](#express-server)
    - [Restarting with Nodemon](#restarting-with-nodemon)
  * [Development Server](#development-server)
- [Secure Cookies](#secure-cookies)
- [Database](#database)
  * [Database Operations](#database-operations)
    - [Testing Connections](#testing-connections)
    - [Writing to a Collection](#writing-to-a-collection)
    - [Searching a Collection](#searching-a-collection)
    - [Updating a Record in a Collection](#updating-a-record-in-a-collection)
    - [Removing a Record from a Collection](#removing-a-record-from-a-collection)
  * [Promise-based Database Methods](#promise-based-database-methods)
- [Helpful Resources](#helpful-resources)

### To Do
- ~~Correctly store login session~~
- ~~Create logout feature~~
- ~~Regex signup email addresses for @~~ **NOTE**: Since we'll eventually validate emails, there's no need to do all the regex required for this.

### Me

I'm Matt Tischler, a software engineer living, working, and learning in the DC area. Separate from my day job I'm working on a few other applications, one of which is _The Greatheart Project_ (shortened here to _TGP_). While the full scope of _TGP_ has yet to be fleshed out, my first step in its creation is to build a reusable repo consisting of a server, client, and database. This repository will be used as a basis for both _TGP_ and future web applications.

### You

Welcome! I'm glad you stopped by. Please feel free to submit a pull request, review some code, fork the repo, or copy any part of this project.

### Getting Started

First, clone the repo:

`git clone git@github.com:mjtischler/greatheart.git`

This project requires [Node.js](https://nodejs.org/en/download/), so be sure you have it installed on your platform of choice. This project will require installing dependencies from both the `/greatheart/client` and `/greatheart/server` directories using:

`npm install`

Config files for [ESLint](https://www.npmjs.com/package/eslint) are provided under each application directory, and will lint according to that application's technology (i.e. `/server` will lint using `eslint-plugin-node` and `/client` will do the same using `eslint-plugin-react`). Your'll want to install these plugins globally if you plan on using ESLint in your editor:

`npm install -g eslint-plugin-node`

`npm install -g eslint-plugin-react`

### Firing up the Application

#### Express Server

The workflow for local development is a tad awkward and may be tweaked in the future. Before running the Express server, you'll want to generate a production build of the project for Express to provide to the client. From the `/greatheart/client` directory:

`npm run build`

**NOTE**: This will delete the last built client-side code from the server's `public` directory and copy the latest front-end updates for Express to serve up. See the client's `package.json` for how we're doing this if you have issues.

To start the Express server, navigate to the `/greatheart/server` directory and run:

`npm start`

This will serve a copy of the production build of the React app and all APIs at `http://localhost:3001/`.

**NOTE**: This version is for production testing and API access only. Any changes to the development version of the client app will not be reflected here until `npm run build` is executed from the `greatheart/client` directory.

##### Restarting with Nodemon

To automatically restart the Express server when a file changes, use:

`npm run nodemon`

#### Development Server

To launch a live-reloading development server, head to `/greatheart/client` and run:

`npm start`

You can now access your client-side code at:

`http://localhost:3000/`

### Secure Cookies

For now, we're going to use secure cookies to store session data. You can choose to use a memory cached method (like Redis or Memcached), or store your sessions in the DB.

Express will look for a secret key `string` for your cookie on application load. You'll need to create a file in `/cookies` called `secret-key.json` and have it contain a random string:

`"THISISASUPERRANDOMAMAZINGSTRING"`

**NOTE**: This directory is `gitignore`'d because it contains sensitive information.

### Database

This project utilizes [MongoDB](https://www.mongodb.com) for data storage. You'll need to sign up for a MongoDB Atlas cluster [here](https://www.mongodb.com/download-center).

Our project will be looking for a database connection string in `/server/db/access/connection-string.json`, which has been `gitignore`'d for this project since it contains sensitive data. You need to create this file using the following template:

`
 "mongodb://{{USERNAME}}:{{PASSWORD}}@{{PRIMARY_NODE}}:27017,{{SECONDARY_NODE_1}}:27017,{{SECONDARY_NODE_2}}:27017/{{DATABASE_NAME}}?ssl=true&replicaSet={{NODE_MASTER_SOURCE}}-0&authSource=admin"
`

Further information on connecting to your Atlas instance can be found [here](https://docs.atlas.mongodb.com/driver-connection/#node-js-driver-example) in the section _MongoDB Version 3.4 and earlier_, and by logging into Atlas and checking *Clusters -> Connect -> Connect Your Application.* Replace the code above demarcated by `{{PARAMETER}}` with the necessary information. Once you've established a connection to your database, you'll be able to perform all necessary CRUD operations.

If you want to avoid installing the entire MongoDB framework on your machine or just like using a GUI, [download Robo 3T](https://robomongo.org/download) and follow [this tutorial](https://www.datduh.com/blog/2017/7/26/how-to-connect-to-mongodb-atlas-using-robo-3t-robomongo) to get connected to your Atlas instances.

#### Database Operations

To access the library of CRUD commands, you'll need to use `require()` in your modules:

`const db = require('../db/db-access');`

**NOTE**: The pathing may vary depending on where your file is located (i.e. `../db/db-access` vs `../../db/db-access`)

You can now call any operation by utilizing `db.{{FUNCTION_NAME}}`.

##### Testing Connections

The `testConnection()` function requires no parameters and will either fail the system (since a database connection is required) or return a successful response.

##### Writing to a Collection
(_Promise-based_, [see below](#promise-based-database-methods))

`writeToCollection()` is used for writing one or more objects to the database and requires two parameters: `collectionName` and `newRecord`. `collectionName` is the document of your database to which you wish to write and must be a `string`. `newRecord` can be an `object`, or an `array` of `objects`. `isInsertingMultiple` is a `boolean` and if `newRecord` is an array then it must set to `true`.

##### Searching a Collection
(_Promise-based_, [see below](#promise-based-database-methods))

`searchCollection()` is used for returning records from a collection based on a query and requires one parameter: `collectionName`. `collectionName` is the document of your database through which you wish to search and must be a `string`. `query` is an `object` that matches the collection's data structure (i.e. the key/pair for which you're searching). Not passing a `query` will return the entire collection.

##### Updating a Record in a Collection
(_Promise-based_, [see below](#promise-based-database-methods))

`updateCollection()` is used for updating one or more objects in the database and requires two parameters: `collectionName` and `recordID`. `collectionName` is the document of your database to which you wish to write and must be a `string`. `recordID` is the `string` key that matches the document's `_id`. `updatedRecord` must be an `object`. **TO DO**: Allow updating multiple records.

##### Removing a Record from a Collection
(_Promise-based_, [see below](#promise-based-database-methods))

`removeFromCollection()` is used for removing a record from the database and requires two parameters: `collectionName` and `recordID`. `collectionName` is the document of your database to which you wish to write and must be a `string`. `recordID` is `string` key that matches the document's `_id`. **TO DO**: Allow removing multiple records.

#### Promise-based Database Methods

CRUD operations against the database will return a promise of either `resolve` or `reject`. When calling a promise-based function in an API, you'll want to append the call with `.then()` to retrieve the response (`updateCollection()` can be an exception depending on circumstance). All CRUD operations return a `.catch()` when a promise is rejected, and that will need to be accounted for as well. An example:

```
router.get('/', (req, res) => {
  db.searchCollection('test')
    .then(resolve => {
      res.json([resolve.result]);
    })
    .catch(reject => {
      console.log(reject.status, reject.result);
    });
});
```

### Helpful Resources

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app) and utilizes tutorials from [Dave Ceddia](https://daveceddia.com/) ([Create React App with an Express Backend](https://daveceddia.com/create-react-app-express-backend/), [Create React App with Express in Production](https://daveceddia.com/create-react-app-express-production/)). You can find further information on tasks related to the React portion of this project [here](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md).

[Daniel Deutsch](https://medium.com/@ddcreationstudi) has written a [good primer](https://medium.com/of-all-things-tech-progress/starting-with-authentication-a-tutorial-with-node-js-and-mongodb-25d524ca0359) on authentication with Node.js and MongoDB. I'm much obliged for his tutelage.
