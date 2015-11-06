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
var MultiValuedHashtable = function (logger) {
    var that = this;
    !!logger ? this.logger = logger : this.logger = mockLogger(true);

    this.clients = {};

};

// Make it an EventEmitter
util.inherits(MultiValuedHashtable, EventEmitter);

MultiValuedHashtable.prototype.put = function (key, client) {
    if('undefined' === typeof this.clients[key])
        this.clients[key] = [];
    this.clients[key].push(client);
    this.emit('added', {key: key, value: client})
};


MultiValuedHashtable.prototype.get = function (key) {
    return this.clients[key];
};

MultiValuedHashtable.prototype.remove = function (key) {
    var client = this.get(key);
    delete this.clients[key];
    this.emit('removed', {key: key, value: client});
};


module.exports = MultiValuedHashtable;