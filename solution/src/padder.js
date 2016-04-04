var wordLength = 16;

var padder = {};

padder.pad = function(toPad) {
  return toPad;
};

padder.buildPadString = function(bufferLength) {
  if (bufferLength === 0) {
    return new Buffer(0);
  }
  var digit = (wordLength - (bufferLength % wordLength));

  var padBuffer = new Buffer(digit);

  for(var i = 0; i < digit; i++) {
    padBuffer.writeInt8(digit, i);
  }

  return padBuffer;
};

module.exports = padder;
