var BaseComponent = require('./baseComponent');
var padder = require('../padder');
var digest = require('../md5');

var KeyValuePair = function(keyOrBuffer, value) {
  if (Buffer.isBuffer(keyOrBuffer)) {
    this.buffer = keyOrBuffer;
  } else {
    this.stringKey = keyOrBuffer;
  }
  this.pojoValue = value;
};
KeyValuePair.prototype = new BaseComponent();

KeyValuePair.findSmallestBlockLength = function(wordlength) {
  return Math.ceil(wordlength / 16) * 16;
}

KeyValuePair.prototype.size = function () {
  return 8 + this.get('key').length +
    KeyValuePair.findSmallestBlockLength(this.get('value').length) + 16;
};

KeyValuePair.prototype.toBuffer = function(cipher) {
  var keyLengthBuf = new Buffer(4);
  var key = padder.addNullByte(this.get('key'));
  keyLengthBuf.writeInt32BE(key.length);

  var valueWithNull = padder.addNullByte(this.get('value'));
  var valueLengthBuf = new Buffer(4);
  var value = padder.pad(valueWithNull);
  var encryptedValue = cipher.update(value);
  valueLengthBuf.writeInt32BE(value.length);

  var digestbuf = digest(this.get('value'));

  return Buffer.concat([
    keyLengthBuf,
    key,
    valueLengthBuf,
    encryptedValue,
    digestbuf
  ]);
};

KeyValuePair.prototype.parseValue = function(cipher) {
  var padded = cipher.update(this.get('value'));
  var unpadded = padder.removePadding(padded);
  var nullRemoved = padder.removeNullByte(unpadded);
  return JSON.parse(nullRemoved.toString('utf8'));
};

KeyValuePair.prototype.parseKey = function() {
  return padder.removeNullByte(this.get('key'))
};

KeyValuePair.prototype.keyParse = function() {
      return this.buffer.slice(4, 4 + this.buffer.readUInt32BE());
    }

KeyValuePair.prototype.keyBuild = function() {
      return new Buffer(this.stringKey);
    }

KeyValuePair.prototype.digestParse = function() {
      var thisLength = this.get('length');
      var digestStart = thisLength - 16;
      return this.buffer.slice(digestStart, thisLength);
    }

KeyValuePair.prototype.digestBuild = function() {
      return digest(this.get('value'));
    }

KeyValuePair.prototype.valueParse = function() {
      var valStart = this.get('key').length + 4;
      var length = this.buffer.readUInt32BE(valStart);
      var offset = valStart + 4;
      return this.buffer.slice(
        offset, offset + KeyValuePair.findSmallestBlockLength(length));
    }

KeyValuePair.prototype.valueBuild = function() {
      return new Buffer(JSON.stringify(this.pojoValue));
    }

module.exports = KeyValuePair;
