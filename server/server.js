var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var path = require('path');
var PropertiesReader = require('properties-reader');
var express = require('express');
var compression = require('compression');
var serveIndex = require('serve-index'); // directory listings middleware
var chokidar = require('chokidar');

var readFilesInDir = require('./lib/helpers').readFilesInDir;
var readFileChunk = require('./lib/helpers').readFileChunk;
var config = PropertiesReader('./conf/tailgate.ini');

var log = console.log.bind(console);

// Initialize watcher
var watcher = chokidar.watch(path.resolve(config.get('disk.tail.dir')), {
    ignored: /[\/\\]\./,
    persistent: true
});

// Make shure watcher is closed on process exit
process.on('exit', function (code) {
    console.log('Exiting with code:', code);
    watcher.close();
});

// Add event listeners
watcher
    .on('add', function (path, stats) {
        log('File', path, 'has been added');
    })
    .on('change', function (path, stats) {
        log('File', path, 'has been changed');
    })
    .on('unlink', function (path) {
        log('File', path, 'has been removed');
    })
    .on('error', function (error) {
        log('Error happened', error);
    })
    .on('ready', function () {
        log('Initial scan complete. Ready for changes.');
    });


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

    readFilesInDir(config.get('disk.tail.dir'), function (err, files) {
        if (!err) {
            socket.emit('files', {files: files});
            console.log('a user connected ');
            console.log(files);
        }
    });

    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
    socket.on('tail', function (msg) {
        //io.emit('msg', msg); // Broadcast to all clients
        console.log('message: ' + msg);
    });
});

// Start the server
//
server.listen(config.get('main.server.port'), function () {
    console.log('listening on *:' + config.get('main.server.port'));
    console.log('Serving client from: ' + path.resolve(config.get('main.server.webroot')));
    console.log('Tailing dir: ' + path.resolve(config.get('disk.tail.dir')));
});