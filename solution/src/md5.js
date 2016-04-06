var crypto = require('crypto');

/**
 * Takes a value and creates on md5 digest.
 *
 * @param {string} input
 * @return {Buffer} digest
 */
module.exports = function(input) {
  return crypto.createHash('md5').update(input).digest();
};
