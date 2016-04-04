var Kvp = require('./keyValuePair');
var padder = require('../padder');
var digest = require('../md5');
var BaseComponent = require('./baseComponent');

var Body = function(spec, ciphers, bufferOrPojo) {
  this.spec = spec;
  this.classSpec = spec.body;
  this.ciphers = ciphers;

  if (Buffer.isBuffer(bufferOrPojo)) {
    this.buffer = bufferOrPojo.slice(
        this.classSpec.start, bufferOrPojo.length);
  } else {
    this.contents = bufferOrPojo;
  }
};
Body.prototype = new BaseComponent();

function generateKvps(contents) {
  return Object.getOwnPropertyNames(contents)
      .map(key => new Kvp(key, contents[key]));
}

Body.prototype.getKvps = function() {
  if (this.kvps === undefined) {
    if (this.buffer !== undefined) {
      this.kvps = Kvp.parse(this.buffer);
    } else {
      this.kvps = generateKvps(this.contents);
    }
  }

  return this.kvps;
};

Body.prototype.getContents = function() {
  return this.getKvps().reduce((aggregate, nextKvp) => {
    aggregate[nextKvp.getKey()] =
      this.decryptValue(nextKvp.getValue());
    return aggregate;
  }, {});
};

Body.prototype.decryptValue = function(value) {
  var padded = this.ciphers.noPad.update(value);
  var unpadded = padder.removePadding(padded);
  var nullRemoved = padder.removeNullByte(unpadded);
  return JSON.parse(nullRemoved.toString('utf8'));
};

Body.prototype.toBuffer = function() {
  return Buffer.concat(this.getKvps().map(kvp => this.kvpToBuffer(kvp)));
};

Body.prototype.kvpToBuffer = function(kvp) {
  var keyLengthBuf = new Buffer(4);
  var key = padder.addNullByte(kvp.getKey());
  keyLengthBuf.writeInt32BE(key.length);

  var valueWithNull = padder.addNullByte(kvp.getValue());
  var valueLengthBuf = new Buffer(4);
  var value = padder.pad(valueWithNull);
  var encryptedValue = this.ciphers.noPad.update(value);
  valueLengthBuf.writeInt32BE(valueWithNull.length);

  var digestbuf = digest(kvp.getValue());

  //console.log(util.inspect(kvp));
  //console.log('keylength: ' + keyLengthBuf);
  //console.log('key: ' + key);
  //console.log('valueLength: ' + valueLengthBuf);
  //console.log('value: ' + encryptedValue);
  //console.log('digest: ' + digestbuf);

  var b =  Buffer.concat([
    keyLengthBuf,
    key,
    valueLengthBuf,
    encryptedValue,
    digestbuf
    ]);

  return b;
};

module.exports = Body;
