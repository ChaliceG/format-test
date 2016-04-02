var blockSpec = require('../spec').testBlock;
var digest = require('../md5').digest;
var randomStrings = require('../randomStrings');

var TestBlock = function(ciphers, optionalBuffer) {
  this.ciphers = ciphers;
  
  if (optionalBuffer !== undefined) {
    this.buffer = optionalBuffer.slice(blockSpec.start, blockSpec.end);
    this.decipheredBuffer = ciphers.noPad.update(this.buffer);
  }
};

function zeroes () {
    var zeroesBuff = new Buffer(
        blockSpec.zeroesEnd - blockSpec.zeroesStart);
    zeroesBuff.fill(0);
    return zeroesBuff;
}

TestBlock.prototype.toBuffer = function () {
    var unencryptedBuffer = Buffer.concat([
            this.getRandomString(),
            digest(this.getRandomString()),
            zeroes()
        ]);

    return unencryptedBuffer;
};

TestBlock.prototype.getRandomString = function () {
    if (this.randomString === undefined) {
        if (this.decipheredBuffer !== undefined) {
            this.randomString = this.decipheredBuffer.slice(
                blockSpec.randomStringStart, blockSpec.randomStringEnd);
        } else {
            this.randomString = randomStrings.cryptoRandom(
                blockSpec.randomStringEnd - blockSpec.randomStringStart);
        }
    }

    return this.randomString;
};

module.exports = TestBlock;
