var test = require('tape');


var SessionHandler = require('../lib/SessionHandler.js');

test('Should be possible to add and get objects', function (t) {

    var o = { id: '1', a: 'test'};

    var sh = new SessionHandler();
    sh.put('1', o );
    t.equal(o, sh.get('1'));
    t.end();

});


test('Should be possible to remove objects', function (t) {

    var o = { id: '1', a: 'test'};

    var sh = new SessionHandler();
    sh.put('1', o );
    sh.remove('1');
    t.equal('undefined', typeof sh.get('1'));
    t.end();
});

test('Should fire added events on put', function (t) {

    var o = { id: '1', a: 'test'};

    var sh = new SessionHandler();
    sh.on('added', function(data) {
        t.equal(o, data.value);
        t.end();
    });

    sh.put('1', o );

});

test('Should fire removed events on remove', function (t) {
    var o = {id: '1', a: 'test'};

    var sh = new SessionHandler();
    sh.on('removed', function (data) {
        t.equal(o, data.value);
        t.end();
    });

    sh.put('1', o);
    sh.remove('1');

});
