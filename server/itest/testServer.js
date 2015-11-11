var winston = require('winston');
winston.emitErrs = true;
var PropertiesReader = require('properties-reader');
var config = PropertiesReader('./conf/itestConf.ini');
var startServer = require('../lib/server.js');

var logger = new winston.Logger({
    transports: [
        new winston.transports.File({
            level: 'debug',
            name: 'integrationTest',
            filename: './logs/itest_out.log',
            handleExceptions: true,
            json: false,
            maxsize: 5242880, //5MB
            maxFiles: 1,
            colorize: false
        })
        /*
        ,
        new winston.transports.Console({
            level: 'debug',
            handleExceptions: true,
            json: false,
            colorize: true
        })
        */
    ],
    exitOnError: false
});

logger.stream = {
    write: function(message, encoding){
        logger.info(message.slice(0, -1));
    }
};

startServer(config, logger);