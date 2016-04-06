var BaseComponent = function() {};

/**
 * Gets a field value from the instance, or looks
 * it up using a parse or build handler.  If a
 * buffer is present, it will attempt to parse
 * the value out of the buffer using the parse
 * handler.  Otherwise, it attempts to build the
 * value using the build handler.
 *
 * Since some build handlers use random number
 * generators and some parse handlers are expensive,
 * the output of these handlers is cached on the
 * instance and the handlers are never called
 * more than once.
 *
 * All handlers are expected to return buffers.
 *
 * @param {string} property
 * @return {Buffer} value
 */
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

  if (!Buffer.isBuffer(this[property])) {
    throw new Error('A handler for ' + property + ' returned a non-buffer.' +
      'All handlers must return buffers.');
  }

  return this[property];
};

module.exports = BaseComponent;
