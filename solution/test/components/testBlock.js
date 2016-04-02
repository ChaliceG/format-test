var TestBlock = require('../../src/components/testBlock');

describe('TestBlock', function () {
    describe('#Constructor', function () {
        it('should take and save ciphers', function () {
            var testBlock = new TestBlock({foo: 'bar'});

            testBlock.ciphers.foo.should.equal('bar');
        });
        it('shoudl take an optional buffer', function () {
            var testBlock = new TestBlock({}, new Buffer(200));

            Buffer.isBuffer(testBlock.buffer).should.equal(true);
        });
    });
    //describe('#toBuffer');
    //describe('#validate');
});