var Head = require('../../src/components/head');
var spec = require('../../src/spec');

describe('Head', function() {
  describe('#constructor', function() {
    it('can take a file buffer and save it', function() {
      var head = new Head(spec, new Buffer(200));

      Buffer.isBuffer(head.buffer).should.equal(true);
    });
    it('should take a slice of the supplied buffer', function() {
      var head = new Head(spec, new Buffer(200));

      head.buffer.length.should.equal(24);
    });
  });
  describe('#createDecipher', function() {
    it('should return a decipher', function() {
      var head = new Head(spec, new Buffer(200));

      var decipher = head.createDecipher('paaaaswrod');

      (typeof decipher).should.equal('object');
    });
    it('requires a password string', function() {
      var head = new Head(spec, new Buffer(200));
      var failed = false;

      try {
        head.createDecipher();
      } catch (err) {
        failed = true;
        err.message.should.contain('password');
      }

      failed.should.equal(true);
    });
  });
  describe('#createCipher', function() {
    it('should return a cipher', function() {
      var head = new Head(spec);

      var cipher = head.createCipher('pwpwpwpwpwpw');

      (typeof cipher).should.equal('object');
    });
    it('requires a password string', function() {
      var head = new Head(spec, new Buffer(200));
      var failed = false;

      try {
        head.createCipher();
      } catch (err) {
        failed = true;
        err.message.should.contain('password');
      }

      failed.should.equal(true);
    });
  });
  describe('#toBuffer', function() {
    it('should return a buffer', function() {
      var head = new Head(spec);

      Buffer.isBuffer(head.toBuffer()).should.equal(true);
    });
  });
});
