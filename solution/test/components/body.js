var Body = require('../../src/components/body');
var digest = require('../../src/md5');
var fs = require('fs');
var crypto = require('crypto');
var algorithm = 'aes128';

var testFile = fs.readFileSync(__dirname + '/../assets/demo.db');
var key = digest('wYl0$uberpass');
var iv = testFile.slice(8, 24);

var testDeciphers = {
  noPad: crypto.createDecipheriv(algorithm, key, iv)
};
var testCiphers = {
  noPad: crypto.createCipheriv(algorithm, key, iv)
};

describe.skip('Body', function() {
  describe('#constructor', function() {
    it('takes ciphers and a file buffer or pojo contents',
        function() {
          var bodyBuffer = new Body(testDeciphers, new Buffer(200));

          Buffer.isBuffer(bodyBuffer.buffer).should.equal(true);
          (typeof bodyBuffer.ciphers.noPad).should.equal('object');

          var bodyPojo = new Body(testCiphers, {foo: 'bar'});

          bodyPojo.contents.should.have.property('foo').equal('bar');
          (typeof bodyBuffer.ciphers.noPad).should.equal('object');
        });
  });
  describe('#getContents', function() {
    it('returns a contents pojo', function() {
      var bodyBuffer = new Body(testDeciphers, testFile);

      var contents = bodyBuffer.getContents();

      contents.should.contain('are you');
    });
  });
  //describe('#toBuffer');
});
