var digest = require('../md5');
var BaseComponent = require('./baseComponent');

var TestBlock = function(spec, cipher, optionalBuffer) {
  this.spec = spec;
  this.classSpec = spec.testBlock;
  this.cipher = cipher;

  if (optionalBuffer !== undefined) {
    this.virginBuffer = optionalBuffer.slice(
      this.classSpec.start, this.classSpec.end);

    this.buffer = cipher.update(this.virginBuffer);
  }
};
TestBlock.prototype = new BaseComponent();

TestBlock.prototype.validate = function() {
  var digestCorrect =
    this.get('digest').equals(digest(this.get('randomString')));
  var zeroesPresent =
    this.spec.zeroes().equals(this.get('zeroes'));

  return digestCorrect && zeroesPresent;
};

module.exports = TestBlock;
