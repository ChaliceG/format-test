var fs = require('fs');
var crypto = require('crypto');
var algorithm = 'aes128';

var file = fs.readFileSync('assets/demo.db');

var password = file.slice(4, 8).toString('utf8') + '$' + 'uberpass';

var hashedPw = crypto.createHash('md5').update(password).digest();

var iv = file.slice(8, 24);

// make decipher

var decipher = crypto.createDecipheriv(algorithm, hashedPw, iv);
decipher.setAutoPadding(false);

// decrypt test

var dec = decipher.update(file.slice(24, 88));

//dec += decipher.final('utf8');
//console.log(dec)

//var decodedBuffer = new Buffer(64);

//decodedBuffer.write(dec);

console.log('random string: ' + dec.slice(0, 32).toString('utf8'))
var digest = crypto.createHash('md5').update(dec.slice(0, 32)).digest();
console.log('md5 digest: ' + digest.toString('utf8'))
console.log('md5 hash: ' + dec.slice(32, 48).toString('utf8'))
console.log('zeroes: ' + dec.slice(48, 64).toString('utf8'))
