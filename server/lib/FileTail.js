var util = require('util');
var EventEmitter = require('events').EventEmitter;
var fs = require('fs');
var path = require('path');

var chokidar = require('chokidar');
var readFileChunk = require('./helpers.js').readFileChunk;
var mockLogger = require('./helpers.js').mockLogger;


/**
 * Class representing the tail of a file.
 * Implements EventEmitter.
 *
 * @param fileName
 * @param logger
 * @constructor
 */
var FileTail = function (fileName, logger) {
    var that = this;
    this.ready = false;
    this.stats = fs.statSync(path.resolve(fileName));
    this.fileName = path.resolve(fileName);

    !!logger ? this.logger = logger : this.logger = mockLogger(true);

    // Initialize watcher
    var watcher = chokidar.watch(path.resolve(fileName), {
        ignored: /[\/\\]\./,
        persistent: true,
        alwaysStat: true,
        awaitWriteFinish: true
    });

    // Make sure watcher is closed on process exit
    process.on('exit', function (code) {
        console.log('Exiting with code:', code);
        watcher.close();
    });

    // Add event listeners
    watcher
        .on('change', function (path, stats) {
            that.logger.debug('File ' + path + ' has been changed');

            var oldSize = that.stats.size;
            var newSize = stats.size;
            that.stats = stats;

            if (that.ready)
                readFileChunk(path, oldSize, newSize, function (err, data) {
                    if (!err)
                        that.emit('change', data);
                });
        })
        .on('unlink', function (path) {
            that.logger.debug('File ' + path + ' has been removed');
            that.emit('unlink', path);
        })
        .on('error', function (error) {
            that.logger.debug('Error happened ' + error);
            that.emit('error', error);
        })
        .on('ready', function () {
            that.logger.debug("Ready");
            that.ready = true;
        });

};

// Make it an EventEmitter
util.inherits(FileTail, EventEmitter);

module.exports = FileTail;