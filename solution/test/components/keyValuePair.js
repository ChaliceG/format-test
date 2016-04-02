var Kvp = require('../../src/components/keyValuePair');

describe('KeyValuePair', function () {
    describe('$parse', function () {
        it('takes a buffer and returns an array of kvps');
    });
    describe('#constructor', function () {
        it('takes a key and value or nothing');
    });
    describe('$findSmallestBlockLength', function () {
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
                function () {
                    Kvp.findSmallestBlockLength(testCase.wordLength)
                        .should.equal(testCase.blockLength);
                });
        });
    });
});