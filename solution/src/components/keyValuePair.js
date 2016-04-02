var spec = require('../spec');

var KeyValuePair = function (key, value) {

};

KeyValuePair.parse = function (buffer) {

};

KeyValuePair.findSmallestBlockLength = function (wordlength) {
    var chunkSize = 0;

    while(wordlength > chunkSize) {
        chunkSize += spec.blockSize;
    }

    return chunkSize;
};

module.exports = KeyValuePair;