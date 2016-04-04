var randomStrings = require('../randomStrings')

var BaseComponent = function () {

};

BaseComponent.prototype.get = function (property) {
    if (this[property] === undefined) {
    if (this.buffer !== undefined) {
      this[property] = parseRandomString.call(this);
    } else {
      this[property] = buildRandomString.call(this);
    }
  }

  return this[property];
};

function parseRandomString() {
    return this.buffer.slice(
          this.classSpec.randomStringStart, this.classSpec.randomStringEnd);
}

function buildRandomString() {
    return randomStrings.cryptoRandom(
          this.classSpec.randomStringEnd - this.classSpec.randomStringStart);
}

module.exports = BaseComponent;