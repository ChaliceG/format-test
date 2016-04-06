var Body = require('../../src/components/body');
var digest = require('../../src/md5');
var fs = require('fs');
var crypto = require('crypto');
var algorithm = 'aes128';

var testFile = fs.readFileSync(__dirname + '/../assets/demo.db');
var key = digest('wYl0$uberpass');
var iv = testFile.slice(8, 24);

var testDecipher = crypto.createDecipheriv(algorithm, key, iv);
testDecipher.setAutoPadding(false);

describe('Body', function() {
  describe('#constructor', function() {
    it('takes a cipher', function() {
      var bodyBuffer = new Body(testDecipher);

      (typeof bodyBuffer.cipher).should.equal('object');
    });
  });
  describe('$parseKvps', function() {
    it('takes a buffer and returns an array of kvps', function() {
      var body = new Body(testDecipher);

      var kvps = body.parseKvps(testFile);

      kvps.length.should.equal(5);
    });
  });
});
