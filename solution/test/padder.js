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
  describe('#buildPadding', function() {
    it('should take an integer and return a buffer', function() {
      Buffer.isBuffer(padder.buildPadding(5)).should.equal(true);
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
      }
    ].forEach(function(testCase) {
      it('creates a pad for buffer of len ' +
        `${testCase.length} with ${testCase.padding}`, function() {

          padder.buildPadding(testCase.length)
            .equals(testCase.padding).should.equal(true);
        });
    });
  });
  describe('#removePadding', function() {
    var nothingPadding = padder.buildPadding(0);
    var nothingResult = new Buffer(0);
    var nothingCase = Buffer.concat([nothingResult, nothingPadding]);

    var longPadding = padder.buildPadding(32);
    var longResult = new Buffer('HelpI\'mTrappedInATestCaseFactory');
    var longCase = Buffer.concat([longResult, longPadding]);
    [
      {
        padding: longPadding,
        buffer: longCase,
        result: longResult
      },
      {
        padding: nothingPadding,
        buffer: nothingCase,
        result: nothingResult
      }
    ].forEach(function(testCase) {
      it(`should remove ${testCase.padding} from the end of ${testCase.buffer}`,
        function() {
          testCase.result.equals(padder.removePadding(testCase.buffer))
            .should.equal(true);
        });
    });
    it('should throw if an empty buffer is passed', function() {
      var failed = false;
      try {
        padder.removePadding(new Buffer(0));
      } catch (err) {
        err.message.should.contain('empty buffer');
        failed = true;
      }
      failed.should.equal(true);
    });
  });
  describe('#removeNullByte', function() {
    it('should remove null bytes', function() {
      var testBuf = new Buffer(6);
      testBuf.fill(0);
      testBuf.write('hello');

      padder.removeNullByte(testBuf).toString('utf8')
        .should.equal('hello');
    });
  });
  describe('#addNullByte', function() {
    it('should add a null byte', function() {
      var testBuf = new Buffer('hello');

      var resultBuf = padder.addNullByte(testBuf);

      resultBuf.length.should.equal(6);
      resultBuf.readInt8(5).should.equal(0);
    });
  });
});
