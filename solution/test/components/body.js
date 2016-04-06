var Body = require('../../src/components/body');
var digest = require('../../src/md5');
var fs = require('fs');
var crypto = require('crypto');
var algorithm = 'aes128';

var testFile = fs.readFileSync(__dirname + '/../assets/demo.db');
var testKvP = testFile.slice(88, 136);
var key = digest('wYl0$uberpass');
var iv = testFile.slice(8, 24);

var testDecipher = crypto.createDecipheriv(algorithm, key, iv);
var testCipher = crypto.createCipheriv(algorithm, key, iv);

describe('Body', function() {
  describe.skip('#constructor', function() {
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
  describe.skip('#getContents', function() {
    it('returns a contents pojo', function() {
      var bodyBuffer = new Body(testDecipher, testFile);

      var contents = bodyBuffer.getContents();

      contents.should.contain('are you');
    });
  });
  describe('$parseKvps', function() {
    it('takes a buffer and returns an array of kvps', function() {
      var bodyBuffer = new Body(testDecipher);
      var kvps = bodyBuffer.parseKvps(testFile);

      kvps.length.should.equal(5);
    });
  });
});
