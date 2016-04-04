var TestBlock = require('../../src/components/testBlock');
var digest = require('../../src/md5');
var fs = require('fs');
var crypto = require('crypto');
var algorithm = 'aes128';

var testFile = fs.readFileSync(__dirname + '/../assets/demo.db');
var key = digest('wYl0$uberpass');
var iv = testFile.slice(8, 24);
var noPadDecipher = crypto.createDecipheriv(algorithm, key, iv);
noPadDecipher.setAutoPadding(false);
var noPadCipher = crypto.createCipheriv(algorithm, key, iv);
noPadCipher.setAutoPadding(false);

var testDeciphers = {
  noPad: noPadDecipher
};
var testCiphers = {
  noPad: noPadCipher
};

describe('TestBlock', function() {
  describe('#Constructor', function() {
    it('should take and save ciphers', function() {
      var testBlock = new TestBlock(testCiphers);

      (typeof testBlock.ciphers.noPad).should.equal('object');
    });
    it('should take an optional buffer and decrypt it', function() {
      var testBlock = new TestBlock(testDeciphers, new Buffer(200));

      Buffer.isBuffer(testBlock.decipheredBuffer).should.equal(true);
    });
  });
  describe('#toBuffer', function() {
    it('should return a buffer of the test block\'s contents', function() {
      var testBlock = new TestBlock(testCiphers);

      var buffer = testBlock.toBuffer();
      Buffer.isBuffer(buffer).should.equal(true);
      buffer.length.should.equal(64);
    });
    it('should encrypt the contents of the test block');
  });
  describe('#validate', function() {
    it.skip('returns true if the digest is the digest of the random string',
    function() {
      var testBlock = new TestBlock(testDeciphers, testFile);

      testBlock.validate().should.equal(true);
    });
  });
});
