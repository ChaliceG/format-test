var BaseComponent = require('./baseComponent');
var padder = require('../padder');
var digest = require('../md5');

var KeyValuePair = function(spec, keyOrBuffer, value) {
  this.spec = spec;
  this.classSpec = spec.keyValuePair;

  if (Buffer.isBuffer(keyOrBuffer)) {
    this.buffer = keyOrBuffer;
  } else {
    this.stringKey = keyOrBuffer;
  }
  this.pojoValue = value;
};
KeyValuePair.prototype = new BaseComponent();

KeyValuePair.prototype.size = function () {
  return this.get('length');
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


module.exports = KeyValuePair;
