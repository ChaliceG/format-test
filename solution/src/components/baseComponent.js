var randomStrings = require('../randomStrings')

var BaseComponent = function () {

};

BaseComponent.prototype.get = function (property) {
    if (this[property] === undefined) {
    if (this.buffer !== undefined) {
      this[property] =
        this.classSpec['parse_' + property].call(this);
    } else {
      this[property] =
        this.classSpec['build_' + property].call(this);
    }
  }

  return this[property];
};





module.exports = BaseComponent;