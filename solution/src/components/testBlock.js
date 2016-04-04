var digest = require('../md5');
var BaseComponent = require('./baseComponent');

var TestBlock = function(spec, ciphers, optionalBuffer) {
  this.spec = spec;
  this.classSpec = spec.testBlock;
  this.ciphers = ciphers;

  if (optionalBuffer !== undefined) {
    this.virginBuffer = optionalBuffer.slice(this.classSpec.start, this.classSpec.end);

    this.buffer = ciphers.noPad.update(this.virginBuffer);
  }
};
TestBlock.prototype = new BaseComponent();

TestBlock.prototype.toBuffer = function() {
  var unencryptedBuffer = Buffer.concat([
          this.get('randomString'),
          digest(this.get('randomString')),
          this.get('zeroes')
      ]);

  return this.ciphers.noPad.update(unencryptedBuffer);
};

TestBlock.prototype.validate = function() {
  var digestCorrect = this.get('digest').equals(digest(this.get('randomString')));
  var zeroesPresent = this.spec.zeroes().equals(this.get('zeroes'));

  return digestCorrect && zeroesPresent;
};

module.exports = TestBlock;
