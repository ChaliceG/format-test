var Padder = function() {
  this.wordLength = 16;
};

Padder.prototype.pad = function(toPad) {
  return toPad;
};

Padder.prototype.buildPadString = function(stringLength) {
  var digit = (this.wordLength - (stringLength % this.wordLength));
  var hexDigit = digit.toString(16);
  var i = 0;
  var ret = '';

  for (; i < digit; i++) {
    ret = ret + hexDigit;
  }

  return ret;
};

module.exports = Padder;
