var padder = require('../src/padder');

describe('Padder', function() {
  describe('#pad', function() {
    it('should take a buffer and return a buffer', function() {
      var test = new Buffer('testone');

      Buffer.isBuffer(padder.pad(test)).should.equal(true);
    });
    it('should return a longer buf for non-block-lengh bufs', function() {
      var test = new Buffer('testone');

      padder.pad(test).length.should.be.above(test.length);
    });
  });
  describe('#buildPadString', function() {
    it('should take an integer and return a string', function() {
      (typeof padder.buildPadString(5)).should.equal('string');
    });
    [
      {
        length: 14,
        padding: new Buffer('0202', 'hex')
      },
      {
        length: 16,
        padding: new Buffer('10101010101010101010101010101010', 'hex')
      },
      {
        length: 17,
        padding: new Buffer('0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f', 'hex')
      },
      {
        length: 0,
        padding: new Buffer(0)
      }
    ].forEach(testCase => {
      it('creates a pad for buffer of len ' +
        `${testCase.length} with ${testCase.padding}`, function() {

        padder.buildPadString(testCase.length)
          .equals(testCase.padding).should.equal(true);
      });
    });
  });
});
