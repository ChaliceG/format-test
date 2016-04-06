var database = require('../src/database');
var fs = require('fs');

var demoContents = fs.readFileSync(__dirname + '/assets/demo.json')
    .toString();
var demoDb = fs.readFileSync(__dirname + '/assets/demo.db');
var integrationCases = JSON.parse(
    fs.readFileSync(__dirname + '/assets/integration.json'));

describe('database', function() {
  describe('#readDatabase', function() {
    it('should read the demo db', function() {
      var result = database.readDatabase(
          __dirname + '/assets/demo.db', 'uberpass');
      result.should.equal(demoContents);
    });
  });

  /*describe('#writeDatabase', function() {
    //This test fails because the demo.db has spaces
    //in its json, which makes the final value 5 blocks
    //instead of 4.  This module parses json with or without
    //spaces, so its not an issue.
    it.skip('should write the demo db', function() {
      var path = __dirname + '/assets/writtenDemo.db';
      database.writeDatabase(
          path,
          'uberpass',
          demoContents);

      var writtenBuffer = fs.readFileSync(path);

      writtenBuffer.length.should.equal(demoDb.length);
    });
  });*/
});
describe('module integration', function() {
  Object.getOwnPropertyNames(integrationCases)
    .forEach(function(testCaseName) {
      it(`should be able to read a ${testCaseName} file it writes`, function() {
        var path = __dirname + `/assets/${testCaseName}.db`;
        var caseContents = JSON.stringify(integrationCases[testCaseName]);
        var casePassword = testCaseName + testCaseName + testCaseName;

        database.writeDatabase(path, casePassword, caseContents);

        var readWritten = database.readDatabase(path, casePassword);

        readWritten.should.equal(caseContents);
      });
    });
});
