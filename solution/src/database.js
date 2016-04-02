var fs = require('fs');
var Head = require('./components/head');
var TestBlock = require('./components/testBlock');
var Body = require('./components/body');

module.exports = {
  readDatabase: function(path, password) {
    var file = fs.readFileSync(path);
    var head = new Head(file);
    var deciphers = head.createDeciphers(password);
    var testBlock = new TestBlock(deciphers, file);

    if (testBlock.validate()) {
      var body = new Body(deciphers, file);

      return body.getContents();
    } else {
      throw new Error('Incorrect password');
    }
  },
  writeDatabase: function(path, password, contents) {
    var head = new Head();
    var ciphers = head.createCiphers(password);
    var testBlock = new TestBlock(ciphers);
    var body = new Body(ciphers, contents);

    fs.writeFileSync(path,
        Buffer.concat([
          head.toBuffer(),
          testBlock.toBuffer(),
          body.toBuffer()
        ]));
  }
};
