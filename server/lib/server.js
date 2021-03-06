var path = require('path');

var express = require('express');
var compression = require('compression');
var serveIndex = require('serve-index'); // directory listings middleware
var _ = require('lodash');

var listFiles = require('./helpers').listFiles;
var fileExists = require('./helpers').exists;
var FileTail = require('./FileTail.js');
var HashTable = require('hashtable');


var startServer = function startServer(config, logger) {

    var app = require('express')();
    var server = require('http').Server(app);
    var io = require('socket.io')(server);


    var tails = new HashTable();
    var clients = new HashTable();

    logger.info('Initializing server.');

    // Configure Winston logging for Express
    app.use(require('morgan')('combined', {"stream": logger.stream}));

    // Serving the client app
    //
    app.use('/', express.static(path.resolve(config.get('main.server.webroot'))));

    // Setup static file serving and file browsing of the monitored folder
    //
    app.use('/tailfiles', express.static(path.resolve(config.get('disk.tail.dir'))));
    app.use('/tailfiles', serveIndex(path.resolve(config.get('disk.tail.dir')), {'icons': true, view: 'details'}));
    app.use(compression()); // Compress responses of all requests


    // Setup websocket event handlers for connecting clients
    //
    io.on('connection', function (socket) {

        listFiles(config.get('disk.tail.dir'), function (err, files) {
            if (!err) {
                socket.emit('files', {files: files}); // Send available files to client
                logger.debug('a user connected id: ' + socket.id);
                //clients.put(socket.id, socket);
            }
        });

        socket.on('disconnect', function () {
            logger.debug('user disconnected');
            tails.forEach(function (fileName, fileTail) {
                fileTail.removeListener('change', clients.get('' + socket.id));
            });
            clients.remove('' + socket.id);
        });

        socket.on('tail', function (msg) {
            logger.debug('tail: ' + msg);
            if (_.has(msg, 'fileName') && fileExists(msg.fileName)) {
                if (tails.get(msg.fileName) == null)
                    tails.put(msg.fileName, new FileTail(msg.fileName));

                var notifyClient = function notifyClient(data) {
                    socket.emit('data', data);
                };

                clients.put('' + socket.id, notifyClient);
                tails.get(msg.fileName).on('change', notifyClient);
            }

        });
    });

    // Start the server
    //
    server.listen(config.get('main.server.port'), function () {
        logger.info('Listening on *:' + config.get('main.server.port'));
        logger.info('Client webroot: ' + path.resolve(config.get('main.server.webroot')));
        logger.info('Tailing dir: ' + path.resolve(config.get('disk.tail.dir')));
    });

};

exports = module.exports = startServer;
