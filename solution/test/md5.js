var md5 = require('../src/md5');

describe('MD5', function() {
  describe('#digest', function() {
    it('makes a hashed buffer of 16 bytes from the input', function() {
      var hash = md5.digest('blahb');

      (typeof hash.write).should.equal('function');
      hash.length.should.equal(16);
    });
  });
});
