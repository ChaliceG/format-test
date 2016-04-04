var digest = require('../src/md5');

describe('#digest', function() {
  it('makes a hashed buffer of 16 bytes from the input', function() {
    var hash = digest('blahb');

    (typeof hash.write).should.equal('function');
    hash.length.should.equal(16);
  });
});

