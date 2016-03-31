var MD5 = function() {};
var crypto = require('crypto');

MD5.prototype.hash = function(input) {
  var hash = crypto.createHash('md5');

  return hash.update(input).digest();
};

module.exports = MD5;
