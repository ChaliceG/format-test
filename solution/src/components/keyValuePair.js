var BaseComponent = require('./baseComponent');

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

KeyValuePair.parse = function(spec, buffer) {
  if (!buffer || !Buffer.isBuffer(buffer) || buffer.length === 0) {
    return [];
  } else {
    var firstKvp = new KeyValuePair(spec, buffer);
    var restKvps = buffer.slice(firstKvp.get('length'), buffer.length);

    return [firstKvp].concat(KeyValuePair.parse(spec, restKvps));
  }
};

module.exports = KeyValuePair;
