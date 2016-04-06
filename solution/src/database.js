var fs = require('fs');
var Head = require('./components/head');
var TestBlock = require('./components/testBlock');
var Body = require('./components/body');
var spec = require('./spec');

module.exports = {
  readDatabase: function(path, password) {
    var file = fs.readFileSync(path);
    var head = new Head(spec, file);
    var decipher = head.createDecipher(password);
    var testBlock = new TestBlock(spec, decipher, file);

    if (testBlock.validate()) {
      var body = new Body(spec, decipher, file);

      return JSON.stringify(body.parseContents(file));
    } else {
      throw new Error('Incorrect password');
    }
  },
  writeDatabase: function(path, password, contents) {
    var head = new Head(spec);
    var cipher = head.createCipher(password);
    var testBlock = new TestBlock(spec, cipher);
    var body = new Body(spec, cipher, JSON.parse(contents));

    fs.writeFileSync(path,
        Buffer.concat([
          head.toBuffer(),
          testBlock.toBuffer(),
          body.toBuffer(JSON.parse(contents))
        ]));
  }
};
