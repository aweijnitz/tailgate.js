var test = require('tape');
var fs = require('fs');
var path = require('path');

var FileTail = require('../lib/FileTail.js');
/*

test('Should emit change events with tail data', function (t) {

    var fileName = path.resolve('test/testData/tailfile0.txt');
    fs.writeFileSync(fileName, '123', 'utf8');
    var tail = new FileTail(fileName);

    var eventFired = false;
    setTimeout(function () {
        t.ok(eventFired, 'Event did not fire in 1000 ms.');
        t.end();
        fs.unlinkSync(fileName);
    }, 1000);

    tail.on('change', function(data) {
        eventFired = true;
        t.equals(data, '456');
        fs.unlink(fileName, function() {});
        t.end();
    });

    process.nextTick(function() {
        fs.appendFileSync(fileName, '456', 'utf8');
    });

});
*/
