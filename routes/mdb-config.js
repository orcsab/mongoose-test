var express = require('express');
var app = express();

if (typeof process.env.MONGOHQ_USER === 'undefined') {
  throw new Error("env var MONGOHQ_USER undefined");
}
if (typeof process.env.MONGOHQ_PASS === 'undefined') {
  throw new Error("env var MONGOHQ_PASS undefined");
}

var config = {
  user: process.env.MONGOHQ_USER,
  pass: process.env.MONGOHQ_PASS,
  server: 'oceanic.mongohq.com',
  port: 10006,
  collection: 'mipitw'
};

require('util').debug('config: ' + JSON.stringify(config));

exports.config = config;