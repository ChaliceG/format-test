var BaseComponent = function() {};

BaseComponent.prototype.get = function(property) {
  if (this[property] === undefined) {
    if (this.buffer !== undefined) {
      if (this[property + 'Parse']) {
        this[property] = this[property + 'Parse']();
      } else {
        throw new Error('Could not find parse handler for ' + property);
      }
    } else {
      if (this[property + 'Build']) {
        this[property] = this[property + 'Build']();
      } else {
        throw new Error('Could not find build handler for ' + property);
      }
    }
  }

  return this[property];
};

module.exports = BaseComponent;
