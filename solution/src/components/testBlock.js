var blockSpec = require('../spec').testBlock;
var digest = require('../md5');
var randomStrings = require('../randomStrings');

var TestBlock = function(ciphers, optionalBuffer) {
  this.ciphers = ciphers;

  if (optionalBuffer !== undefined) {
    this.buffer = optionalBuffer.slice(blockSpec.start, blockSpec.end);

    this.decipheredBuffer = ciphers.noPad.update(this.buffer);
  }
};

function zeroes() {
  var zeroesBuff = new Buffer(
      blockSpec.zeroesEnd - blockSpec.zeroesStart);
  zeroesBuff.fill(0);
  return zeroesBuff;
}

TestBlock.prototype.toBuffer = function() {
  var unencryptedBuffer = Buffer.concat([
          this.getRandomString(),
          digest(this.getRandomString()),
          this.getZeroes()
      ]);

  return this.ciphers.noPad.update(unencryptedBuffer);
};

TestBlock.prototype.getRandomString = function() {
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

TestBlock.prototype.getZeroes = function() {
  if (this.zeroes === undefined) {
    if (this.decipheredBuffer !== undefined) {
      this.zeroes = this.decipheredBuffer.slice(
          blockSpec.zeroesStart, blockSpec.zeroesEnd);
    } else {
      this.zeroes = zeroes();
    }
  }

  return this.zeroes;
};

TestBlock.prototype.getDigest = function() {
  if (this.digest === undefined) {
    if (this.decipheredBuffer !== undefined) {
      this.digest = this.decipheredBuffer.slice(
          blockSpec.digestStart, blockSpec.digestEnd);
    } else {
      this.digest = digest(this.getRandomString());
    }
  }

  return this.digest;
};

TestBlock.prototype.validate = function() {
  //console.log('randomString: ' + this.getRandomString());
  //console.log('digest: ' + this.getDigest());
  //console.log('digestOfString: ' + digest(this.getRandomString()));
  //console.log('zeroes: ' + this.getZeroes());
  var digestCorrect = this.getDigest().equals(digest(this.getRandomString()));
  var zeroesPresent = zeroes().equals(this.getZeroes());

  return digestCorrect && zeroesPresent;
};

module.exports = TestBlock;
