var database = require('../src/database');

describe('database', function () {
    describe('#readDatabase', function () {
        it('should do work', function () {
            var result = database.readDatabase(
                __dirname + '/assets/demo.db', 'uberpass');
            console.log(result);
        });
    });
});