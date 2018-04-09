'use strict';

const appRoot = require('app-root-path');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, colorize } = format;

const outputFormat = printf(info => `${info.timestamp} ${info.level}: ${info.message}`);

const ghLogger = createLogger({
  format: combine(
    colorize(),
    timestamp(),
    outputFormat
  ),
  transports: [
    new transports.File({
      filename: `${appRoot}/logs/info.log`,
      level: 'info',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      handleExceptions: true
    }),
    new transports.File({
      filename: `${appRoot}/logs/error.log`,
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      handleExceptions: true
    }),
    new transports.Console({
      level: 'info',
      handleExceptions: true
    }),
    new transports.Console({
      level: 'error',
      handleExceptions: true
    })
  ],
  exitOnError: false
});

ghLogger.stream = {
  write: function (message, encoding) {
    ghLogger.info(message, encoding);
  }
};

module.exports = ghLogger;
