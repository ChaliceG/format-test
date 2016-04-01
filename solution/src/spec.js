module.exports = {
  format: 'utf8',
  algorithm: 'aes128',
  head: {
    keyString: function(salt, password) {
      return salt + '$' + password;
    },
    start: 0,
    end: 24,
    saltStart: 4,
    saltEnd: 8,
    ivStart: 8,
    ivEnd: 24
  }
};
