var crypto = require('crypto');

module.exports = {
  digest: function(input) {
    return crypto.createHash('md5').update(input).digest();
  }
};
