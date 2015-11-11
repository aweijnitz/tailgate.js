var logger = require('./lib/logger.js');
var PropertiesReader = require('properties-reader');
var config = PropertiesReader('./conf/tailgate.ini');
var startServer = require('./lib/server.js');

startServer(config, logger);