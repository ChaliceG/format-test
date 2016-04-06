var fs = require('fs');
var Head = require('./components/head');
var TestBlock = require('./components/testBlock');
var Body = require('./components/body');

module.exports = {
  readDatabase: function(path, password) {
    var file = fs.readFileSync(path);
    var head = new Head(file);
    var decipher = head.createDecipher(password);
    var testBlock = new TestBlock(decipher, file);

    if (testBlock.validate()) {
      var body = new Body(decipher, file);

      return JSON.stringify(body.parseContents(file));
    } else {
      throw new Error('Incorrect password');
    }
  },
  writeDatabase: function(path, password, contents) {
    var pojoContents = JSON.parse(contents);
    var head = new Head();
    var cipher = head.createCipher(password);
    var testBlock = new TestBlock(cipher);
    var body = new Body(cipher, pojoContents);

    fs.writeFileSync(path,
      Buffer.concat([
        head.toBuffer(),
        testBlock.toBuffer(),
        body.toBuffer(pojoContents)
      ]));
  }
};
