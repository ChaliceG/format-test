var randomStrings = require('./randomStrings');
var digest = require('./md5');

function zeroes() {
  var zeroesBuff = new Buffer(16);
  zeroesBuff.fill(0);
  return zeroesBuff;
}

module.exports = {
  format: 'utf8',
  blockSize: 16,
  algorithm: 'aes128',
  zeroes: zeroes,
  head: {
    start: 0,
    end: 24,
    marker: new Buffer('badcab00', 'hex'),
    keyString: function(salt, password) {
      return salt + '$' + password;
    },
    saltParse: function () {
      return this.buffer.slice(4, 8);
    },
    saltBuild: function () {
      return randomStrings.alphanumeric(4);
    },
    ivParse: function () {
      return this.buffer.slice(8, 24);
    },
    ivBuild: function () {
      return randomStrings.cryptoRandom(16);
    },
    toBuffer: function () {
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
    randomStringParse: function () {
      return this.buffer.slice(0, 32);
    },
    randomStringBuild: function() {
      return randomStrings.cryptoRandom(32);
    },
    zeroesParse: function (){
      return this.buffer.slice(48, 64);
    },
    zeroesBuild: zeroes,
    digestParse: function() {
      return this.buffer.slice(32, 48);
    },
    digestBuild: function () {
      return digest(this.get('randomString'));
    },
    toBuffer: function () {
      var unencryptedBuffer = Buffer.concat([
        this.get('randomString'),
        digest(this.get('randomString')),
        this.get('zeroes')
      ]);
      return this.ciphers.noPad.update(unencryptedBuffer);
    }
  },
  body: {
    start: 88
  },
  keyValuePair: {
    
  }
};


