module.exports = {
  format: 'utf8',
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
    randomStringStart: 24,
    randomStringEnd: 56,
    digestStart: 56,
    digestEnd: 72,
    zeroesStart: 72,
    zeroesEnd: 88
  }
};
