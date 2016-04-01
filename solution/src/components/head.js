var spec = require('../spec');
var headSpec = spec.head;
var digest = require('../md5').digest;
var crypto = require('crypto');
var randomStrings = require('../randomStrings');

var Head = function(optionalBuffer) {
    if (optionalBuffer !== undefined) {
        this.buffer = optionalBuffer.slice(headSpec.start, headSpec.end);
    }
};

Head.prototype.createDeciphers = function(password) {
  if (typeof password !== 'string') {
    throw new Error('Head.createDeciphers requires a string password');
  }

  var key = this.generateKey(password);
  var iv = this.getIv();

  var autoPad = crypto.createDecipheriv(spec.algorithm, key, iv);
  var noPad = crypto.createDecipheriv(spec.algorithm, key, iv);
  noPad.setAutoPadding(false);

  return {
    autoPad: autoPad,
    noPad: noPad
  };
};

Head.prototype.createCiphers = function(password) {
    if (typeof password !== 'string') {
        throw new Error('Head.createCiphers requires a string password');
    }

    var key = this.generateKey(password);
    var iv = this.getIv();

    var autoPad = crypto.createCipheriv(spec.algorithm, key, iv);
    var noPad = crypto.createCipheriv(spec.algorithm, key, iv);
    noPad.setAutoPadding(false);

    return {
        autoPad: autoPad,
        noPad: noPad
    };
};

Head.prototype.generateKey = function(password) {
  var saltString = this.getSalt().toString(spec.format);
  return digest(headSpec.keyString(saltString, password));
};

Head.prototype.getSalt = function() {
  if (this.salt === undefined) {
    if (Buffer.isBuffer(this.buffer)) {
      this.salt = this.buffer.slice(headSpec.saltStart, headSpec.saltEnd);
    } else {
      this.salt = randomStrings.alphanumeric(headSpec.saltEnd - headSpec.saltStart);
    }
  }

  return this.salt;
};

Head.prototype.getIv = function() {
  if (this.iv === undefined) {
    if (Buffer.isBuffer(this.buffer)) {
      this.iv = this.buffer.slice(headSpec.ivStart, headSpec.ivEnd);
    } else {
        this.iv = randomStrings.cryptoRandom(headSpec.ivEnd - headSpec.ivStart);
    }
  }

  return this.iv;
};

module.exports = Head;
