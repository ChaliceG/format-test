var randomStrings = require('./randomStrings');
var digest = require('./md5');

function zeroes() {
  var zeroesBuff = new Buffer(16);
  zeroesBuff.fill(0);
  return zeroesBuff;
}

function findSmallestBlockLength(wordlength) {
  return Math.ceil(wordlength / spec.blockSize) * spec.blockSize;
}

var spec = {
  blockSize: 16,
  zeroes: zeroes,
  findSmallestBlockLength: findSmallestBlockLength,
  testBlock: {
    start: 24,
    end: 88,
    randomStringParse: function() {
      return this.buffer.slice(0, 32);
    },
    randomStringBuild: function() {
      return randomStrings.cryptoRandom(32);
    },
    zeroesParse: function() {
      return this.buffer.slice(48, 64);
    },
    zeroesBuild: zeroes,
    digestParse: function() {
      return this.buffer.slice(32, 48);
    },
    digestBuild: function() {
      return digest(this.get('randomString'));
    },
    toBuffer: function() {
      var unencryptedBuffer = Buffer.concat([
        this.get('randomString'),
        digest(this.get('randomString')),
        this.get('zeroes')
      ]);
      return this.cipher.update(unencryptedBuffer);
    }
  },
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
