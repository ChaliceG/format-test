var Head = require('../src/components/head');

describe('Head', function() {
  describe('#constructor', function() {
    it('can take a file buffer and save it', function() {
      var head = new Head(new Buffer(200));

      Buffer.isBuffer(head.buffer).should.equal(true);
    });
    it('should take a slice of the supplied buffer', function() {
      var head = new Head(new Buffer(200));

      head.buffer.length.should.equal(24);
    });
  });
  describe('#createDeciphers', function() {
    it('should return two deciphers', function() {
      var head = new Head(new Buffer(200));

      var deciphers = head.createDeciphers('paaaaswrod');

      (typeof deciphers.autoPad).should.equal('object');
      (typeof deciphers.noPad).should.equal('object');
    });
    it('requires a password string', function() {
      var head = new Head(new Buffer(200));
      var failed = false;

      try {
        head.createDeciphers();
      } catch (err) {
        failed = true;
        err.message.should.contain('password');
      }

      failed.should.equal(true);
    });
  });
  describe('#generateKey', function() {
    it('should use ');
  });
});
