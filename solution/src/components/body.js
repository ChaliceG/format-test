var Kvp = require('./keyValuePair');
var padder = require('../padder');
var digest = require('../md5');
var BaseComponent = require('./baseComponent');

var Body = function(spec, cipher, bufferOrPojo) {
  this.spec = spec;
  this.classSpec = spec.body;
  this.cipher = cipher;

  if (Buffer.isBuffer(bufferOrPojo)) {
    this.buffer = bufferOrPojo.slice(
        this.classSpec.start, bufferOrPojo.length);
  } else {
    this.contents = bufferOrPojo;
  }
};
Body.prototype = new BaseComponent();

Body.prototype.getKvps = function() {
  if (this.kvps === undefined) {
    if (this.buffer !== undefined) {
      this.kvps = Kvp.parse(this.spec, this.buffer);
    } else {
      this.kvps = Object.getOwnPropertyNames(this.contents)
      .map(key => new Kvp(this.spec, key, this.contents[key]));
    }
  }

  return this.kvps;
};

Body.prototype.getContents = function() {
  return this.getKvps().reduce((aggregate, nextKvp) => {
    var objectKey = padder.removeNullByte(nextKvp.get('key'));
    aggregate[objectKey] = this.decryptValue(nextKvp.get('value'));
    return aggregate;
  }, {});
};

Body.prototype.decryptValue = function(value) {
  var padded = this.cipher.update(value);
  var unpadded = padder.removePadding(padded);
  var nullRemoved = padder.removeNullByte(unpadded);
  return JSON.parse(nullRemoved.toString(this.spec.format));
};

Body.prototype.toBuffer = function() {
  return Buffer.concat(this.getKvps().map(kvp => this.kvpToBuffer(kvp)));
};

Body.prototype.kvpToBuffer = function(kvp) {
  var keyLengthBuf = new Buffer(4);
  var key = padder.addNullByte(kvp.get('key'));
  keyLengthBuf.writeInt32BE(key.length);

  var valueWithNull = padder.addNullByte(kvp.get('value'));
  var valueLengthBuf = new Buffer(4);
  var value = padder.pad(valueWithNull);
  var encryptedValue = this.cipher.update(value);
  valueLengthBuf.writeInt32BE(value.length);

  var digestbuf = digest(kvp.get('value'));

  return Buffer.concat([
    keyLengthBuf,
    key,
    valueLengthBuf,
    encryptedValue,
    digestbuf
  ]);
};

module.exports = Body;
