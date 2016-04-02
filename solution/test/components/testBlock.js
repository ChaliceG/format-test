var TestBlock = require('../../src/components/testBlock');
var randomStrings = require('../../src/randomStrings');
var digest = require('../../src/md5').digest;
var crypto = require('crypto');
var algorithm = 'aes128';

var key = digest('testkey');
var iv = randomStrings.cryptoRandom(16);
var noPadDecipher = crypto.createDecipheriv(algorithm, key, iv);
noPadDecipher.setAutoPadding(false);
var noPadCipher = crypto.createCipheriv(algorithm, key, iv);
noPadCipher.setAutoPadding(false);

var testDeciphers = {
    noPad: noPadDecipher
};
var testCiphers = {
    noPad: noPadCipher
};

describe('TestBlock', function () {
    describe('#Constructor', function () {
        it('should take and save ciphers', function () {
            var testBlock = new TestBlock(testCiphers);

            (typeof testBlock.ciphers.noPad).should.equal('object');
        });
        it('should take an optional buffer and decrypt it', function () {
            var testBlock = new TestBlock(testDeciphers, new Buffer(200));

            Buffer.isBuffer(testBlock.decipheredBuffer).should.equal(true);
        });
    });
    describe('#toBuffer', function () {
        it('should return a buffer of the testblock\'s contents', function () {
            var testBlock = new TestBlock(testCiphers);

            var buffer = testBlock.toBuffer();
            Buffer.isBuffer(buffer).should.equal(true);
            buffer.length.should.equal(64);
        });
    });
    //describe('#validate');
});