var Body = require('../../src/components/body');
var digest = require('../../src/md5');
var fs = require('fs');
var crypto = require('crypto');
var algorithm = 'aes128';

var testFile = fs.readFileSync(__dirname + '/../assets/demo.db');
var key = digest('wYl0$uberpass');
var iv = testFile.slice(8, 24);

var testDecipher = crypto.createDecipheriv(algorithm, key, iv);
var testCipher = crypto.createCipheriv(algorithm, key, iv);

describe.skip('Body', function() {
  describe('#constructor', function() {
    it('takes ciphers and a file buffer or pojo contents',
        function() {
          var bodyBuffer = new Body(testDecipher, new Buffer(200));

          Buffer.isBuffer(bodyBuffer.buffer).should.equal(true);
          (typeof bodyBuffer.cipher).should.equal('object');

          var bodyPojo = new Body(testCipher, {foo: 'bar'});

          bodyPojo.contents.should.have.property('foo').equal('bar');
          (typeof bodyBuffer.cipher).should.equal('object');
        });
  });
  describe('#getContents', function() {
    it('returns a contents pojo', function() {
      var bodyBuffer = new Body(testDecipher, testFile);

      var contents = bodyBuffer.getContents();

      contents.should.contain('are you');
    });
  });
});
