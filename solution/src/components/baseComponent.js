var BaseComponent = function() {};

BaseComponent.prototype.get = function(property) {
  if (this[property] === undefined) {
    if (this.buffer !== undefined) {
        if (this[property + 'Parse']) {
            this[property] = this[property + 'Parse']();
        } else {
            this[property] = this.classSpec[property + 'Parse'].call(this);
        }
    } else {
        if (this[property + 'Build']) {
            this[property] = this[property + 'Build']();
        } else {
            this[property] = this.classSpec[property + 'Build'].call(this);
        }
    }
  }

  return this[property];
};

BaseComponent.prototype.toBuffer = function() {
  return this.classSpec.toBuffer.call(this);
};

module.exports = BaseComponent;
