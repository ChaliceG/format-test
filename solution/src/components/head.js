var digest = require('../md5');
var crypto = require('crypto');
var randomStrings = require('../randomStrings');

var Head = function(spec, optionalBuffer) {
  this.spec = spec;
  this.classSpec = spec.head;
  if (optionalBuffer !== undefined) {
    this.buffer = optionalBuffer.slice(this.classSpec.start, this.classSpec.end);
  }
};

function createCipher(instance, password, constructor, algorithm) {
  if (typeof password !== 'string') {
    throw new Error('Head.createDeciphers requires a string password');
  }

  var key = instance.generateKey(password);
  var iv = instance.getIv();

  var autoPad = constructor(algorithm, key, iv);
  var noPad = constructor(algorithm, key, iv);
  noPad.setAutoPadding(false);

  return {
    autoPad: autoPad,
    noPad: noPad
  };
}

Head.prototype.createDeciphers = function(password) {
  return createCipher(this, password, crypto.createDecipheriv, this.spec.algorithm);
};

Head.prototype.createCiphers = function(password) {
  return createCipher(this, password, crypto.createCipheriv, this.spec.algorithm);
};

Head.prototype.generateKey = function(password) {
  var saltString = this.getSalt().toString(this.spec.format);
  return digest(this.classSpec.keyString(saltString, password));
};

Head.prototype.getSalt = function() {
  if (this.salt === undefined) {
    if (Buffer.isBuffer(this.buffer)) {
      this.salt = this.buffer.slice(this.classSpec.saltStart, this.classSpec.saltEnd);
    } else {
      this.salt = randomStrings.alphanumeric(
        this.classSpec.saltEnd - this.classSpec.saltStart);
    }
  }

  return this.salt;
};

Head.prototype.getIv = function() {
  if (this.iv === undefined) {
    if (Buffer.isBuffer(this.buffer)) {
      this.iv = this.buffer.slice(this.classSpec.ivStart, this.classSpec.ivEnd);
    } else {
      this.iv = randomStrings.cryptoRandom(this.classSpec.ivEnd - this.classSpec.ivStart);
    }
  }

  return this.iv;
};

Head.prototype.toBuffer = function() {
  var newBuffer = Buffer.concat([
      this.classSpec.marker,
      this.getSalt(),
      this.getIv()
      ]);

  this.buffer = newBuffer;

  return this.buffer;
};

module.exports = Head;
