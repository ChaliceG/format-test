var digest = require('../md5');
var crypto = require('crypto');
var BaseComponent = require('./baseComponent');

var Head = function(spec, optionalBuffer) {
  this.spec = spec;
  this.classSpec = spec.head;
  if (optionalBuffer !== undefined) {
    this.buffer = optionalBuffer.slice(
      this.classSpec.start, this.classSpec.end);
  }
};
Head.prototype = new BaseComponent();

function createCipher(instance, password, constructor, algorithm) {
  if (typeof password !== 'string') {
    throw new Error('Head.createDeciphers requires a string password');
  }

  var key = instance.generateKey(password);
  var iv = instance.get('iv');

  var noPad = constructor(algorithm, key, iv);
  noPad.setAutoPadding(false);

  return noPad;
}

Head.prototype.createDecipher = function(password) {
  return createCipher(this, password,
    crypto.createDecipheriv,
    this.spec.algorithm);
};

Head.prototype.createCipher = function(password) {
  return createCipher(this, password,
    crypto.createCipheriv,
    this.spec.algorithm);
};

Head.prototype.generateKey = function(password) {
  var saltString = this.get('salt').toString(this.spec.format);
  return digest(this.classSpec.keyString(saltString, password));
};

module.exports = Head;
