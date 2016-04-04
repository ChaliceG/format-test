var bodySpec = require('../spec').body;
var Kvp = require('./keyValuePair');
var padder = require('../padder');

var Body = function(ciphers, bufferOrPojo) {
  this.ciphers = ciphers;

  if (Buffer.isBuffer(bufferOrPojo)) {
    this.buffer = bufferOrPojo.slice(
        bodySpec.start, bufferOrPojo.length);
  } else {
    this.contents = bufferOrPojo;
  }
};

function generateKvps(contents) {
  return contents.getOwnPropertyNames()
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
  return Buffer.concat(this.getKvps().map(kvp => kvp.toBuffer()));
};

module.exports = Body;
