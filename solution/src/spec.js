var randomStrings = require('./randomStrings');
var digest = require('./md5');



function findSmallestBlockLength(wordlength) {
  return Math.ceil(wordlength / spec.blockSize) * spec.blockSize;
}

var spec = {
  blockSize: 16,
  findSmallestBlockLength: findSmallestBlockLength,
  keyValuePair: {
    keyParse: function() {
      return this.buffer.slice(4, 4 + this.buffer.readUInt32BE());
    },
    keyBuild: function() {
      return new Buffer(this.stringKey);
    },
    digestParse: function() {
      var thisLength = this.get('length');
      var digestStart = thisLength - 16;
      return this.buffer.slice(digestStart, thisLength);
    },
    digestBuild: function() {
      return digest(this.get('value'));
    },
    valueParse: function() {
      var valStart = this.get('key').length + 4;
      var length = this.buffer.readUInt32BE(valStart);
      var offset = valStart + 4;
      return this.buffer.slice(
        offset, offset + findSmallestBlockLength(length));
    },
    valueBuild: function() {
      return new Buffer(JSON.stringify(this.pojoValue));
    }
  }
};

module.exports = spec;
