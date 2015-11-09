var logger = require("lib/logger");
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var path = require('path');

var PropertiesReader = require('properties-reader');

var express = require('express');
var compression = require('compression');
var serveIndex = require('serve-index'); // directory listings middleware
var _ = require('lodash');

var listFiles = require('./lib/helpers').listFiles;
var fileExists = require('./lib/helpers').exists;
var config = PropertiesReader('./conf/tailgate.ini');

var FileTail = require('./lib/FileTail.js');

var HashTable = require('hashtable');
var tails = new HashTable();
var clients = new HashTable();


// Configure Winston logging for Express
app.use(require('morgan')({ "stream": logger.stream }));

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
            console.log('a user connected id: ' + socket.id);
            //clients.put(socket.id, socket);
        }
    });

    socket.on('disconnect', function () {
        console.log('user disconnected');
        tails.forEach(function(fileName, fileTail) {
            fileTail.removeListener('change', clients.get(''+socket.id));
        });
        clients.remove(''+socket.id);
    });

    socket.on('tail', function (msg) {
        console.log('tail: ' + msg);
        if (_.has(msg, 'fileName') && fileExists(msg.fileName)) {
            if(tails.get(msg.fileName) == null)
                tails.put(msg.fileName, new FileTail(msg.fileName));

            var notifyClient = function notifyClient(data) {
                socket.emit('data', data);
            };

            clients.put(''+socket.id, notifyClient);
            tails.get(msg.fileName).on('change', notifyClient);
        }

    });
});

// Start the server
//
server.listen(config.get('main.server.port'), function () {
    console.log('Listening on *:' + config.get('main.server.port'));
    console.log('Client webroot: ' + path.resolve(config.get('main.server.webroot')));
    console.log('Tailing dir: ' + path.resolve(config.get('disk.tail.dir')));
});