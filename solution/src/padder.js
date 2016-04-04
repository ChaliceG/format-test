var wordLength = 16;

var padder = {};

padder.pad = function(toPad) {
  return Buffer.concat([toPad, padder.buildPadding(toPad.length)]);
};

padder.buildPadding = function(bufferLength) {
  var digit = (wordLength - (bufferLength % wordLength));

  var padBuffer = new Buffer(digit);

  var i = 0;
  for (; i < digit; i++) {
    padBuffer.writeInt8(digit, i);
  }

  return padBuffer;
};

padder.removePadding = function(paddedBuffer) {
  if (!paddedBuffer ||
    paddedBuffer.length === 0) {
    throw new Error('Cannot remove padding from null or empty buffer');
  }
  var digit = paddedBuffer.readInt8(paddedBuffer.length - 1);
  if (digit > 0 && digit <= wordLength) {
    return paddedBuffer.slice(0, paddedBuffer.length - digit);
  }
  throw new Error(
    'Could not remove padding from buffer; ' +
    'buffer is malformed with final byte: ' +
    paddedBuffer.slice(paddedBuffer.length - 1, paddedBuffer.length));
};

padder.removeNullByte = function(bufferWithNull) {
  if (bufferWithNull.readInt8(bufferWithNull.length - 1) === 0) {
    return bufferWithNull.slice(0, bufferWithNull.length - 1);
  }
  throw new Error(
    'Attempted to remove null byte from buffer that didn\'t have one.');
};

padder.addNullByte = function(nakedBuffer) {
  var nullByte = new Buffer(1);
  nullByte.writeInt8(0);
  return Buffer.concat([nakedBuffer, nullByte]);
};

module.exports = padder;
