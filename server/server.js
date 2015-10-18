var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var path = require('path');
var readFilesInDir = require('./lib/helpers').readFilesInDir;

var conf = {
    tailDir: 'log'
};


app.get('/', function (req, res) {
    res.sendFile(__dirname + '/webroot/index.html');
});

io.on('connection', function (socket) {

    readFilesInDir(conf.tailDir, function(err, files) {
        if(!err) {
            socket.emit('files', { files: files });
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

http.listen(3000, function () {
    console.log('listening on *:3000');
});