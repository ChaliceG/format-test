var Padder = require('../src/padder');

describe('Padder', function () {
    describe('#constructor', function () {
        it('should take a word length', function () {
            var padder = new Padder(16);
            padder.wordLength.should.equal(16);
        });
    });
    describe('#pad', function () {
        it('should take a string and return a string', function () {
            var test = 'testone';
            var padder = new Padder(16);

            (typeof padder.pad(test)).should.equal('string');
        });
    });
});