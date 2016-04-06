var digest = require('../md5');
var crypto = require('crypto');
var BaseComponent = require('./baseComponent');
var randomStrings = require('../randomStrings');

var Head = function(optionalBuffer) {
  if (optionalBuffer !== undefined) {
    this.buffer = optionalBuffer.slice(0, 24);
  }
};
Head.prototype = new BaseComponent();

function createCipher(instance, password, constructor) {
  if (typeof password !== 'string') {
    throw new Error('Head.createDeciphers requires a string password');
  }

  var key = instance.generateKey(password);
  var iv = instance.get('iv');

  var noPad = constructor('aes128', key, iv);
  noPad.setAutoPadding(false);

  return noPad;
}

function keyString(salt, password) {
  return salt + '$' + password;
}

Head.prototype.createDecipher = function(password) {
  return createCipher(this, password,
    crypto.createDecipheriv);
};

Head.prototype.createCipher = function(password) {
  return createCipher(this, password,
    crypto.createCipheriv);
};

Head.prototype.generateKey = function(password) {
  var saltString = this.get('salt').toString('utf8');
  return digest(keyString(saltString, password));
};

Head.prototype.saltParse = function() {
  return this.buffer.slice(4, 8);
};

Head.prototype.saltBuild = function() {
  return randomStrings.alphanumeric(4);
};

Head.prototype.ivParse = function() {
  return this.buffer.slice(8, 24);
};

Head.prototype.ivBuild = function() {
  return randomStrings.cryptoRandom(16);
};

Head.prototype.toBuffer = function() {
  return Buffer.concat([
    new Buffer('badcab00', 'hex'),
    this.get('salt'),
    this.get('iv')
  ]);
};

module.exports = Head;
