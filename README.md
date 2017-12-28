This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app) and utilizes tutorials from [Dave Ceddia](https://daveceddia.com/) ([Create React App with an Express Backend](https://daveceddia.com/create-react-app-express-backend/), [Create React App with Express in Production](https://daveceddia.com/create-react-app-express-production/)).

You can find further information on tasks related to the React portion of this project [here](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md).

### Table of Contents

- [To do](#to-do)
- [Me](#me)
- [You](#you)
- [Getting Started](#getting-started)
- [Firing up the Application](#firing-up-the-application)
  * [Express Server](#express-server)
  * [Development Server](#development-server)
- [Database](#database)


#### To Do

- Install a database
- Connect the database to an API

#### Me

I'm Matt Tischler, a software engineer living, working, and learning in the DC area. Separate from my day job I'm working on a few other applications, one of which is _The Greatheart Project_ (shortened here to _TGP_). While the full scope of _TGP_ has yet to be fleshed out, my first step in its creation is to build a resuable repo consisting of a server, client, and database. This repository will be used as a basis for both _TGP_ and future web applications.

#### You

Welcome! I'm glad you stopped by. Please feel free to submit a pull request, review some code, fork the repo, or copy any part of this project.

#### Getting Started

First, clone the repo:

`git clone git@github.com:mjtischler/greatheart.git`

This project requires [Node.js](https://nodejs.org/en/download/), so be sure you have it installed on your platform of choice. This project will require installing dependencies from both the `/greatheart/client` and `/greatheart/server` directories using:

`npm install`

Config files for [ESLint](https://www.npmjs.com/package/eslint) are provided under each application directory, and will lint according to that application's technology (i.e. `/server` will lint using `eslint-plugin-node` and '/client' will do the same using `eslint-plugin-react`).

#### Firing up the Application

##### Express Server

The workflow for local development is a tad awkward and may be tweaked in the future. Before running the Express server, you'll want to generate a production build of the project for Express to provide to the client. From the `/greatheart/client` directory:

`npm run build`

To start the Express server, navigate to the `/greatheart/server` directory and run:

`npm start`

This will serve a copy of the production build of the React app and all APIs at `http://localhost:3001/`.

**NOTE**: This version is for production testing and API access only. Any changes to the development version of the client app will not be reflected here until `npm run build` is executed from the `greatheart/client` directory, and live-reloading via the development server won't work.

##### Development Server

To launch a live-reloading development server, head to `/greatheart/client` and run:

`npm start`

You can now access your client-side code at:

`http://localhost:3000/`

#### Database

This project utilizes [MongoDB](https://www.mongodb.com) for data storage. You'll need to sign up for a MongoDB Atlas cluster [here](https://www.mongodb.com/download-center).

Our project will be looking for a database connection string in `/server/db/access/connection-string.json`, which has been `gitignore`'d for this project since it contains sensitive data. You need to create this file using the following template:

`
 "mongodb://{{USERNAME}}:{{PASSWORD}}@{{PRIMARY_NODE}}:27017,{{SECONDARY_NODE_1}}:27017,{{SECONDARY_NODE_2}}:27017/admin?ssl=true&replicaSet={{NODE_MASTER_SOURCE}}-0&authSource=admin"
`

Further information on connecting to your Atlas instance can be found [here](https://docs.atlas.mongodb.com/driver-connection/#node-js-driver-example) in the section _MongoDB Version 3.4 and earlier_, and by logging into Atlas and checking *Clusters -> Connect -> Connect Your Application.* Replace the code above demarcated by `{{PARAMETER}}` with the necessary information. Once you've established a connection to your database, you'll be able to perform all necessary CRUD operations.

If you want to avoid installing the entire MongoDB framework on your machine or just like using a GUI, [download Robo 3T](https://robomongo.org/download) and follow [this tutorial](https://www.datduh.com/blog/2017/7/26/how-to-connect-to-mongodb-atlas-using-robo-3t-robomongo) to get connected to your Atlas instances.
