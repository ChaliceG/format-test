var digest = require('../md5');
var crypto = require('crypto');
var randomStrings = require('../randomStrings');
var BaseComponent = require('./baseComponent');

var Head = function(spec, optionalBuffer) {
  this.spec = spec;
  this.classSpec = spec.head;
  if (optionalBuffer !== undefined) {
    this.buffer = optionalBuffer.slice(this.classSpec.start, this.classSpec.end);
  }
};
Head.prototype = new BaseComponent();

function createCipher(instance, password, constructor, algorithm) {
  if (typeof password !== 'string') {
    throw new Error('Head.createDeciphers requires a string password');
  }

  var key = instance.generateKey(password);
  var iv = instance.get('iv');

  var autoPad = constructor(algorithm, key, iv);
  var noPad = constructor(algorithm, key, iv);
  noPad.setAutoPadding(false);

  return {
    autoPad: autoPad,
    noPad: noPad
  };
}

Head.prototype.createDeciphers = function(password) {
  return createCipher(this, password,
    crypto.createDecipheriv,
    this.spec.algorithm);
};

Head.prototype.createCiphers = function(password) {
  return createCipher(this, password,
    crypto.createCipheriv,
    this.spec.algorithm);
};

Head.prototype.generateKey = function(password) {
  var saltString = this.get('salt').toString(this.spec.format);
  return digest(this.classSpec.keyString(saltString, password));
};

module.exports = Head;
