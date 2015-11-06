var util = require('util');
var EventEmitter = require('events').EventEmitter;

var mockLogger = require('./helpers.js').mockLogger;


/**
 * Class keeping track of client sessions.
 * Implements EventEmitter.
 *
 * @param logger
 * @constructor
 */
var SessionHandler = function (logger) {
    var that = this;
    !!logger ? this.logger = logger : this.logger = mockLogger(true);

    this.clients = {};

};

// Make it an EventEmitter
util.inherits(SessionHandler, EventEmitter);

SessionHandler.prototype.put = function (key, client) {
    if ('undefined' === typeof this.get(key))
        this.clients[key] = [];

    this.clients[key].push(client);
    this.emit('added', {key: key, value: client})
};


SessionHandler.prototype.get = function (key) {
    return this.clients[key];
};

SessionHandler.prototype.remove = function (key) {
    var client = this.get(key);
    delete this.clients[key];
    this.emit('removed', {key: key, value: client});
};


module.exports = SessionHandler;