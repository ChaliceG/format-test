var database = require('../src/database');
var fs = require('fs');

var demoContents = fs.readFileSync(__dirname + '/assets/demo.json').toString();

describe('database', function() {
  describe('#readDatabase', function() {
    it('should read the demo db', function() {
      var result = database.readDatabase(
          __dirname + '/assets/demo.db', 'uberpass');

      result.should.equal(demoContents);
    });
  });
});
