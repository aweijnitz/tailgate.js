var test = require('tape');
var fs = require('fs');
var path = require('path');

var helpers = require('../lib/helpers');


test('listFiles should return list of all *files* in a given folder', function (t) {
    var fileName0 = 'test/testData/testfile0.txt';
    var fileName1 = 'test/testData/testfile1.txt';
    var dir = 'test/testData';
    var dummyDir = path.resolve(dir + path.sep + 'dummmyDir');

    // Create two files and a folder. Expected result is only the files.
    fs.writeFileSync(fileName0, '123', 'utf8');
    fs.writeFileSync(fileName1, '456', 'utf8');
    fs.mkdirSync(dummyDir);

    helpers.listFiles(dir, function (err, data) {
        if (err)
            t.end(err);
        else {
            t.equals(2, data.length);
            fs.unlinkSync(fileName0);
            fs.unlinkSync(fileName1);
            fs.rmdirSync(dummyDir);
            t.end();
        }
    });
});


test('exists should return true if a fle exists', function (t) {
    var fileName0 = 'test/testData/existing.txt';
    fs.writeFileSync(fileName0, '123', 'utf8');

    t.ok(helpers.exists(fileName0));
    fs.unlinkSync(fileName0);
    t.end();
});

test('exists should return false if argument is a folder', function (t) {
    var dir = 'test/testData';
    var dummyDir = path.resolve(dir + path.sep + 'dummmyDir');
    fs.mkdirSync(dummyDir);

    t.ok(!helpers.exists(dummyDir));
    fs.rmdirSync(dummyDir);
    t.end();

});

test('exists should return false if file does not exist', function (t) {
    t.ok(!helpers.exists('falsePath'));
    t.end();
});



test('readFileChunk should return new data from the end of a file', function (t) {
    var fileName = 'test/testData/testfile0.txt';
    fs.writeFileSync(fileName, '123', 'utf8');
    var before = fs.statSync(fileName);
    fs.appendFileSync(fileName, '456', 'utf8');
    var after = fs.statSync(fileName);
    t.equals(3, after.size - before.size);
    helpers.readFileChunk(fileName, before.size, after.size, function (err, data) {
        if (err)
            t.end(err);
        else {
            t.equals('456', data.toString('utf8'));
            fs.unlinkSync(fileName);
            t.end();
        }
    });
});


test('readFileChunk should return empty string for zero diff', function (t) {
    var fileName = 'test/testData/testfile1.txt';
    fs.writeFileSync(fileName, '123', 'utf8');
    var before = fs.statSync(fileName);
    var after = fs.statSync(fileName);
    t.equals(0, after.size - before.size);
    helpers.readFileChunk(fileName, before.size, after.size, function (err, data) {
        if (err)
            t.end(err);
        else {
            t.equals('', data.toString('utf8'));
            fs.unlinkSync(fileName);
            t.end();
        }
    });
});


test('readFileChunk should return empty string for negative diff', function (t) {
    var fileName = 'test/testData/testfile2.txt';
    fs.writeFileSync(fileName, '123', 'utf8');
    var before = fs.statSync(fileName);
    fs.writeFileSync(fileName, '12', 'utf8');
    var after = fs.statSync(fileName);
    t.equals(-1, after.size - before.size);
    helpers.readFileChunk(fileName, before.size, after.size, function (err, data) {
        if (err)
            t.end(err);
        else {
            t.equals('', data.toString('utf8'));
            fs.unlinkSync(fileName);
            t.end();
        }
    });
});


test('mockLogger returns log object with four functions', function (t) {
    var log = helpers.mockLogger(false);
    t.equals('object', typeof log, 'log is an object');
    t.equals('function', typeof log.debug);
    t.equals('function', typeof log.info);
    t.equals('function', typeof log.warn);
    t.equals('function', typeof log.error);
    t.end();
});

test('mockLogger can be called using empty constructor', function (t) {
    var log = helpers.mockLogger(false);
    t.equals('object', typeof log, 'log is an object');
    t.end();
});