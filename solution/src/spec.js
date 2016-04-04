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
  format: 'utf8',
  blockSize: 16,
  algorithm: 'aes128',
  zeroes: zeroes,
  findSmallestBlockLength: findSmallestBlockLength,
  head: {
    start: 0,
    end: 24,
    marker: new Buffer('badcab00', 'hex'),
    keyString: function(salt, password) {
      return salt + '$' + password;
    },
    saltParse: function() {
      return this.buffer.slice(4, 8);
    },
    saltBuild: function() {
      return randomStrings.alphanumeric(4);
    },
    ivParse: function() {
      return this.buffer.slice(8, 24);
    },
    ivBuild: function() {
      return randomStrings.cryptoRandom(16);
    },
    toBuffer: function() {
      return Buffer.concat([
        this.classSpec.marker,
        this.get('salt'),
        this.get('iv')
      ]);
    }
  },
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
  body: {
    start: 88
  },
  keyValuePair: {
    keyParse: function() {
      return this.buffer.slice(4, 3 + this.buffer.readUInt32BE());
    },
    keyBuild: function() {
      return new Buffer(this.stringKey);
    },
    digestParse: function() {
      var thisLength = this.getLength();
      var digestStart = thisLength - 16;
      return this.buffer.slice(digestStart, thisLength);
    },
    digestBuild: function() {
      return digest(this.get('value'));
    },
    valueParse: function() {
      var valStart = this.get('key').length + 5;
      var length = this.buffer.readUInt32BE(valStart);
      var offset = valStart + 4;
      return this.buffer.slice(
        offset, offset + findSmallestBlockLength(length));
    },
    valueBuild: function() {
      return new Buffer(JSON.stringify(this.pojoValue));
    },
    lengthParse: function() {
      return 8 + this.get('key').length + 1 +
      this.spec.findSmallestBlockLength(this.get('value').length) + 16;
    }
  }
};

module.exports = spec;
