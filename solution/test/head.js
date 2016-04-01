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
  describe('#createCiphers', function() {
    it('should return two ciphers', function() {
      var head = new Head();

      var ciphers = head.createCiphers('pwpwpwpwpwpw');

      (typeof ciphers.autoPad).should.equal('object');
      (typeof ciphers.noPad).should.equal('object');
    });
    it('requires a password string', function() {
      var head = new Head(new Buffer(200));
      var failed = false;

      try {
        head.createCiphers();
      } catch (err) {
        failed = true;
        err.message.should.contain('password');
      }

      failed.should.equal(true);
    });
  });
  describe('#toBuffer', function() {
    it('should return a buffer', function() {
      var head = new Head();

      Buffer.isBuffer(head.toBuffer()).should.equal(true);
    });
  });
});
