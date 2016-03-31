var MD5 = require('../src/md5');

describe('MD5', function() {
  describe('#hash', function() {
    it('makes a hashed buffer of 16 bytes from the input', function() {
      var md5 = new MD5();
      var hash = md5.hash('blahb');

      (typeof hash.write).should.equal('function');
      hash.length.should.equal(16);
    });
  });
});
