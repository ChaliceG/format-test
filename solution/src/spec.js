module.exports = {
  format: 'utf8',
  blockSize: 16,
  algorithm: 'aes128',
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
    randomStringStart: 0,
    randomStringEnd: 32,
    digestStart: 32,
    digestEnd: 48,
    zeroesStart: 48,
    zeroesEnd: 64
  },
  body: {
    start: 88
  }
};
