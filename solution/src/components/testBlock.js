var digest = require('../md5');
var BaseComponent = require('./baseComponent');
var randomStrings = require('../randomStrings');

var TestBlock = function(cipher, optionalBuffer) {
  this.cipher = cipher;

  if (optionalBuffer !== undefined) {
    this.virginBuffer = optionalBuffer.slice(24, 88);

    this.buffer = cipher.update(this.virginBuffer);
  }
};
TestBlock.prototype = new BaseComponent();

function zeroes() {
  var zeroesBuff = new Buffer(16);
  zeroesBuff.fill(0);
  return zeroesBuff;
}

TestBlock.prototype.validate = function() {
  var digestCorrect =
    this.get('digest').equals(digest(this.get('randomString')));
  var zeroesPresent =
    zeroes().equals(this.get('zeroes'));

  return digestCorrect && zeroesPresent;
};

TestBlock.prototype.randomStringParse = function() {
  return this.buffer.slice(0, 32);
};

TestBlock.prototype.randomStringBuild = function() {
  return randomStrings.cryptoRandom(32);
};

TestBlock.prototype.zeroesParse = function() {
  return this.buffer.slice(48, 64);
};

TestBlock.prototype.zeroesBuild = zeroes;

TestBlock.prototype.digestParse = function() {
  return this.buffer.slice(32, 48);
};

TestBlock.prototype.digestBuild = function() {
  return digest(this.get('randomString'));
};

TestBlock.prototype.toBuffer = function() {
  var unencryptedBuffer = Buffer.concat([
    this.get('randomString'),
    digest(this.get('randomString')),
    this.get('zeroes')
  ]);
  return this.cipher.update(unencryptedBuffer);
};

module.exports = TestBlock;
