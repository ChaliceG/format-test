var Kvp = require('../../src/components/keyValuePair');
var fs = require('fs');

var testFile = fs.readFileSync(__dirname + '/../assets/demo.db');
var testKvP = testFile.slice(88, 136);

describe('KeyValuePair', function() {
  describe('$parse', function() {
    it('takes a buffer and returns an array of kvps', function() {
      var kvps = Kvp.parse(Buffer.concat([testKvP, testKvP, testKvP]));

      kvps.length.should.equal(3);
    });
  });
  describe('#constructor', function() {
    it('takes a key and value or nothing');
  });
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
          Kvp.findSmallestBlockLength(testCase.wordLength)
            .should.equal(testCase.blockLength);
        });
    });
  });
});
