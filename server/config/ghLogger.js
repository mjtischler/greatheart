'use strict';

const appRoot = require('app-root-path');
const winston = require('winston');

const options = {
  fileInfo: {
    level: 'info',
    filename: `${appRoot}/logs/infoLog.json`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false
  },
  fileError: {
    level: 'error',
    filename: `${appRoot}/logs/errorLog.json`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true
  }
};

const ghLogger = new winston.createLogger({
  transports: [
    new winston.transports.File(options.fileInfo),
    new winston.transports.File(options.fileError),
    new winston.transports.Console(options.console)
  ],
  exitOnError: false // do not exit on handled exceptions
});

ghLogger.stream = {
  write: function (message, encoding) {
    ghLogger.info(message);
  }
};

module.exports = ghLogger;
