var randomStrings = require('../src/randomStrings');

describe('randomStrings', function() {
  describe('#alphanumeric', function() {
    it('should return a buffer of input length', function() {
      var buffer = randomStrings.alphanumeric(4);

      Buffer.isBuffer(buffer).should.equal(true);
      buffer.length.should.equal(4);
    });
  });
  describe('#cryptoRandom', function() {
    it('should return a buffer of input length', function() {
      var buffer = randomStrings.cryptoRandom(5);

      Buffer.isBuffer(buffer).should.equal(true);
      buffer.length.should.equal(5);
    });
  });
});
