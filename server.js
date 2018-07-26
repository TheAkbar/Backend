var express = require('express');
var path = require('path');
var app = express();
var db = require('./db');

global.include = require('./paths')

//app.use('/assets', require("./assets/assets"));
app.use('/login', require(global.include.controller.login.routes));
app.use('/server', require(global.include.controller.server.routes));

db.connect(function(err) {
  if (err) {
    console.log('Unable to connect to MySQL.');
    process.exit(1);
  } else {
    app.listen(3300, function() {
      console.log('Listening on port 3300...');
    });
  }
});
