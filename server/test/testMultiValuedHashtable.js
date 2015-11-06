var test = require('tape');


var MultiValuedHashtable = require('../lib/MultiValuedHashtable.js');

test('MultiValuedHashtable: Should be possible to add and get objects', function (t) {

    var o0 = { id: '1', a: 'test'};
    var o1 = { id: '2', b: 'test'};

    var sh = new MultiValuedHashtable();
    sh.put('1', o0 );
    sh.put('1', o1 );

    t.deepEqual([o0,o1], sh.get('1'));
    t.end();

});


test('MultiValuedHashtable: Should be possible to remove objects', function (t) {

    var o = { id: '1', a: 'test'};

    var sh = new MultiValuedHashtable();
    sh.put('1', o );
    sh.remove('1');
    t.equal('undefined', typeof sh.get('1'));
    t.end();
});

test('MultiValuedHashtable: Should fire added events on put', function (t) {

    var o = { id: '1', a: 'test'};

    var sh = new MultiValuedHashtable();
    sh.on('added', function(data) {
        t.equal(o, data.value);
        t.end();
    });

    sh.put('1', o );

});

test('MultiValuedHashtable: Should fire removed events on remove', function (t) {
    var o = {id: '1', a: 'test'};

    var sh = new MultiValuedHashtable();
    sh.on('removed', function (data) {
        t.deepEqual([o], data.value);
        t.end();
    });

    sh.put('1', o);
    sh.remove('1');

});
