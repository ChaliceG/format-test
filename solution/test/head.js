var Head = require('../src/components/head');
var expect = require('chai').expect;

describe('Head', function() {
  describe('-buffer', function() {
    it('should be a hex buffer representing the head', function() {
      var testbuf = new Buffer(26);
      testbuf.fill(0);
      var head = new Head(testbuf);

      expect(head.buffer.equals(testbuf));
    });
  });
});
