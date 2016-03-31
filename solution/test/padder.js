var Padder = require('../src/padder');

describe.skip('Padder', function() {
  describe('#constructor', function() {
    it('should set the word length to 16', function() {
      var padder = new Padder();

      padder.wordLength.should.equal(16);
    });
  });
  describe('#pad', function() {
    it('should take a string and return a string', function() {
      var test = 'testone';
      var padder = new Padder();

      (typeof padder.pad(test)).should.equal('string');
    });
    it('should always return a longer string', function() {
      var test = 'testone';
      var padder = new Padder();

      padder.pad(test).length.should.be.above(test.length);
    });
  });
  describe('#buildPadString', function() {
    it('should take an integer and return a string', function() {
      var padder = new Padder();

      (typeof padder.buildPadString(5)).should.equal('string');
    });
    [
      {
        length: 14,
        padding: '22'
      },
      {
        length: 16,
        padding: 'fffffffffffffff'
      }
    ].forEach(testCase => {
      it('creates a pad for str of len ' +
        `${testCase.length} with ${testCase.padding}`, function() {
        var padder = new Padder();

        padder.buildPadString(testCase.length)
          .should.equal(testCase.padding);
      });
    });
  });
});
