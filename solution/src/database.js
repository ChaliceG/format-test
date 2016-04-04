var fs = require('fs');
var Head = require('./components/head');
var TestBlock = require('./components/testBlock');
var Body = require('./components/body');
var spec = require('./spec');

module.exports = {
  readDatabase: function(path, password) {
    var file = fs.readFileSync(path);
    var head = new Head(spec, file);
    var deciphers = head.createDeciphers(password);
    var testBlock = new TestBlock(deciphers, file);

    if (testBlock.validate()) {
      var body = new Body(spec, deciphers, file);

      return JSON.stringify(body.getContents());
    } else {
      throw new Error('Incorrect password');
    }
  },
  writeDatabase: function(path, password, contents) {
    var head = new Head(spec);
    var ciphers = head.createCiphers(password);
    var testBlock = new TestBlock(ciphers);
    var body = new Body(spec, ciphers, JSON.parse(contents));

    fs.writeFileSync(path,
        Buffer.concat([
          head.toBuffer(),
          testBlock.toBuffer(),
          body.toBuffer()
        ]));
  }
};
