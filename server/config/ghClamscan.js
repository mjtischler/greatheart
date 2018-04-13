'use strict';

const path = require('path');

const ghClamscan = require('clamscan')({
  remove_infected: true, // Removes files if they are infected
  quarantine_infected: false, // Move file here. remove_infected must be FALSE, though.
  scan_recursively: true, // Choosing false here will save some CPU cycles
  scan_log: path.join(__dirname, '../logs/clamscan.log'), // You're a detail-oriented security professional.
  debug_mode: true, // This will put some debug info in your js console
  file_list: null, // path to file containing list of files to scan
  clamscan: {
    path: '/usr/bin/clamscan', // I dunno, maybe your clamscan is just call "clam"
    db: null, // Path to a custom virus definition database
    scan_archives: false, // Choosing false here will save some CPU cycles
    active: true // activates clamscan
  },
  preference: 'clamscan' // If clamscan is found and active, it will be used by default
});

module.exports = ghClamscan;
