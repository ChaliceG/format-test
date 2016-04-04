var randomStrings = require('./randomStrings');

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
    keyString: function(salt, password) {
      return salt + '$' + password;
    },
    start: 0,
    end: 24,
    marker: new Buffer('badcab00', 'hex'),
    saltStart: 4,
    saltEnd: 8,
    ivStart: 8,
    ivEnd: 24
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
    }    
  },
  body: {
    start: 88
  }
};


