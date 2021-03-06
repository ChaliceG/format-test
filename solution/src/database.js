var fs = require('fs');
var Head = require('./components/head');
var TestBlock = require('./components/testBlock');
var Body = require('./components/body');

module.exports = {
  /**
  * Reads the database contents encrypted in the file
  * at the path given using the password given. Will
  * throw if the given password cannot decrypt the file.
  *
  * @param {string} path
  * @param {string} password
  * @return {string} jsonDatabase
  */
  readDatabase: function(path, password) {
    var file = fs.readFileSync(path);
    var head = new Head(file);
    var decipher = head.createDecipher(password);
    var testBlock = new TestBlock(decipher, file);

    if (testBlock.validate()) {
      var body = new Body(decipher);

      return JSON.stringify(body.parseContents(file));
    } else {
      throw new Error('Incorrect password');
    }
  },
  /**
  * Encrypts the json string contents to the file at
  * the given path using the given password.
  *
  * @param {string} path
  * @param {string} password
  * @param {string} jsonDatabase
  */
  writeDatabase: function(path, password, jsonDatabase) {
    var pojoContents;
    try {
      pojoContents = JSON.parse(jsonDatabase);
    } catch (err) {
      throw new Error('Contents must be a valid json string.  Error: ' +
        err.message);
    }
    var head = new Head();
    var cipher = head.createCipher(password);
    var testBlock = new TestBlock(cipher);
    var body = new Body(cipher);

    fs.writeFileSync(path,
      Buffer.concat([
        head.toBuffer(),
        testBlock.toBuffer(),
        body.toBuffer(pojoContents)
      ]));
  }
};
