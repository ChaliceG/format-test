var Body = require('../../src/components/body');
var digest = require('../../src/md5').digest;
var fs = require('fs');
var crypto = require('crypto');
var algorithm = 'aes128';

var testFile = fs.readFileSync(__dirname + '/../assets/demo.db');
var key = digest('wYl0$uberpass');
var iv = testFile.slice(8, 24);

var testDeciphers = {
  autoPad: crypto.createDecipheriv(algorithm, key, iv)
};
var testCiphers = {
  autoPad: crypto.createCipheriv(algorithm, key, iv)
};

describe('Body', function () {
    describe('#constructor', function () {
        it('takes ciphers and a file buffer or pojo contents',
        function () {
            var bodyBuffer = new Body(testDeciphers, new Buffer(200));

            Buffer.isBuffer(bodyBuffer.buffer).should.equal(true);
            (typeof bodyBuffer.ciphers.autoPad).should.equal('object');

            var bodyPojo = new Body(testCiphers, {foo: 'bar'});

            bodyPojo.contents.should.have.property('foo').equal('bar');
            (typeof bodyBuffer.ciphers.autoPad).should.equal('object');
        });
    });
    describe('#getContents', function () {
        it('returns a contents pojo', function () {
            var bodyBuffer = new Body(testDeciphers, testFile);

            var contents = bodyBuffer.getContents();

            console.log(contents)
            contents.should.have.property('are you');
        });
    });
    //describe('#toBuffer');
});