'use strict';

const appStructure = this;
const fs = require('fs');
const path = require('path');
const directories = [
  'cookies',
  'db/access',
  'logs',
  'Public',
  'Public/assets',
  'Public/posts',
  'Public/posts/images',
  'Public/static',
  'Public/static/css',
  'Public/static/js'
];

this.createDirectories = serverRoot => {
  directories.forEach(directory => {
    const directoryToCreate = path.join(serverRoot, directory);

    if (!fs.existsSync(directoryToCreate)) {
      console.log(`Creating directory: ${directoryToCreate}`);
      fs.mkdirSync(directoryToCreate);
    }
  });
};

module.exports = appStructure;
