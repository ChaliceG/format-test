var spec = require('../src/spec');

describe('spec', function () {
    describe('$findSmallestBlockLength', function() {
    [
      {
        wordLength: 4,
        blockLength: 16
      },
      {
        wordLength: 0,
        blockLength: 0
      },
      {
        wordLength: 16,
        blockLength: 16
      },
      {
        wordLength: 31,
        blockLength: 32
      },
      {
        wordLength: 65,
        blockLength: 80
      }
    ].forEach(testCase => {
      it(`it should return ${testCase.blockLength} for ${testCase.wordLength}`,
        function() {
          spec.findSmallestBlockLength(testCase.wordLength)
            .should.equal(testCase.blockLength);
        });
    });
  });
});