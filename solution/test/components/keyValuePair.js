var Kvp = require('../../src/components/keyValuePair');
var fs = require('fs');
var spec = require('../../src/spec');

var testFile = fs.readFileSync(__dirname + '/../assets/demo.db');
var testKvP = testFile.slice(88, 136);

describe('KeyValuePair', function() {
  describe('$parse', function() {
    it('takes a buffer and returns an array of kvps', function() {
      var kvps = Kvp.parse(spec, Buffer.concat([testKvP, testKvP, testKvP]));

      kvps.length.should.equal(3);
    });
  });
});
