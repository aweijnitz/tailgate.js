var test = require('tape');
var fs = require('fs');

var helpers = require('../lib/helpers');


test('readFileChunk should return new data from the end of a file', function (t) {
    var fileName = 'test/testData/testfile.txt';
    fs.writeFileSync(fileName, '123', 'utf8');
    var before = fs.statSync(fileName);
    fs.appendFileSync(fileName, '456', 'utf8');
    var after = fs.statSync(fileName);
    t.equals(3, after.size - before.size);
    var added = helpers.readFileChunk(fileName, before.size, after.size, function(err, data) {
        if(err)
            t.end(err);
        else {
            t.equals('456', data.toString('utf8'));
            fs.unlinkSync(fileName);
            t.end();
        }
    });
});


test('readFileChunk should return empty string for zero diff', function (t) {
    var fileName = 'test/testData/testfile.txt';
    fs.writeFileSync(fileName, '123', 'utf8');
    var before = fs.statSync(fileName);
    var after = fs.statSync(fileName);
    t.equals(0, after.size - before.size);
    var added = helpers.readFileChunk(fileName, before.size, after.size, function(err, data) {
        if(err)
            t.end(err);
        else {
            t.equals('', data.toString('utf8'));
            fs.unlinkSync(fileName);
            t.end();
        }
    });
});


test('readFileChunk should return empty string for negative diff', function (t) {
    var fileName = 'test/testData/testfile.txt';
    fs.writeFileSync(fileName, '123', 'utf8');
    var before = fs.statSync(fileName);
    fs.writeFileSync(fileName, '12', 'utf8');
    var after = fs.statSync(fileName);
    t.equals(-1, after.size - before.size);
    var added = helpers.readFileChunk(fileName, before.size, after.size, function(err, data) {
        if(err)
            t.end(err);
        else {
            t.equals('', data.toString('utf8'));
            fs.unlinkSync(fileName);
            t.end();
        }
    });
});