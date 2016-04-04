var digest = require('../md5');
var randomStrings = require('../randomStrings');
var BaseComponent = require('./baseComponent');

var TestBlock = function(spec, ciphers, optionalBuffer) {
  this.spec = spec;
  this.classSpec = spec.testBlock;
  this.ciphers = ciphers;
  
  if (optionalBuffer !== undefined) {
    this.buffer = optionalBuffer.slice(this.classSpec.start, this.classSpec.end);

    this.decipheredBuffer = ciphers.noPad.update(this.buffer);
  }
};
TestBlock.prototype = new BaseComponent();

function zeroes() {
  var zeroesBuff = new Buffer(16);
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
          this.classSpec.randomStringStart, this.classSpec.randomStringEnd);

    } else {
      this.randomString = randomStrings.cryptoRandom(
          this.classSpec.randomStringEnd - this.classSpec.randomStringStart);
    }
  }

  return this.randomString;
};

TestBlock.prototype.getZeroes = function() {
  if (this.zeroes === undefined) {
    if (this.decipheredBuffer !== undefined) {
      this.zeroes = this.decipheredBuffer.slice(
          this.classSpec.zeroesStart, this.classSpec.zeroesEnd);
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
          this.classSpec.digestStart, this.classSpec.digestEnd);
    } else {
      this.digest = digest(this.getRandomString());
    }
  }

  return this.digest;
};

TestBlock.prototype.validate = function() {
  var digestCorrect = this.getDigest().equals(digest(this.getRandomString()));
  var zeroesPresent = zeroes().equals(this.getZeroes());

  return digestCorrect && zeroesPresent;
};

module.exports = TestBlock;
