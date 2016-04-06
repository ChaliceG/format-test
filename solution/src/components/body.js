var Kvp = require('./keyValuePair');

var Body = function(cipher) {
  this.cipher = cipher;
};

Body.prototype.parseKvps = function(buffer) {
  var start = 88;
  var end = buffer.length;
  var allKvps = [];

  while (start < end) {
    var firstKvp = new Kvp(buffer.slice(start, end));
    start += firstKvp.size();
    allKvps.push(firstKvp);
  }

  return allKvps;
};

Body.prototype.buildKvps = function(contents) {
  return Object.getOwnPropertyNames(contents)
      .map(key => new Kvp(key, contents[key]));
};

Body.prototype.parseContents = function(buffer) {
  var contents = {};

  this.parseKvps(buffer).forEach(kvp => {
    contents[kvp.parseKey()] = kvp.parseValue(this.cipher);
  });

  return contents;
};

Body.prototype.toBuffer = function(contents) {
  return Buffer.concat(this.buildKvps(contents)
    .map(kvp => kvp.toBuffer(this.cipher)));
};

module.exports = Body;
