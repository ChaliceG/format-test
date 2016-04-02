var spec = require('../spec');
var digest = require('../md5').digest;

var KeyValuePair = function (keyOrBuffer, value) {
    if (Buffer.isBuffer(keyOrBuffer)) {
        this.buffer = keyOrBuffer;
    } else {
        this.stringKey = keyOrBuffer;
    }
    this.stringValue = value;
};

KeyValuePair.parse = function (buffer) {
    if (!buffer || !Buffer.isBuffer(buffer) || buffer.length === 0) {
        return [];
    } else {
        var firstKvp = new KeyValuePair(buffer);
        var restKvps = buffer.slice(firstKvp.getLength(), buffer.length);

        return [firstKvp].concat(KeyValuePair.parse(restKvps));
    }
};

KeyValuePair.prototype.getKey = function () {
    if(this.key === undefined) {
        if (this.buffer !== undefined) {
            var length = this.buffer.readUInt32BE();
            var offset = 4;
            this.key = this.buffer.slice(offset, offset + length -1);
        } else {
            //turn key into utf8 string buffer
        }
    }

    return this.key;
};

KeyValuePair.prototype.getValue = function () {
    if(this.value === undefined) {
        if (this.buffer !== undefined) {
            var valStart = this.getKey().length + 5;
            var length = this.buffer.readUInt32BE(valStart);
            var offset = valStart + 4;
            this.value = this.buffer.slice(offset, offset + length);
        } else {
            //turn pojo into json buffer
        }
    }

    return this.value;
};

KeyValuePair.prototype.getDigest = function () {
    if(this.digest === undefined) {
        if (this.buffer !== undefined) {
            var thisLength = this.getLength();
            var digestStart = thisLength - 16;
            this.digest = this.buffer.slice(digestStart, thisLength);
        } else {
            this.digest = digest(this.getValue());
        }
    }

    return this.digest;
};

KeyValuePair.prototype.getLength = function () {
    return 8 + this.getKey().length + 1 +
        this.getValue().length + 16;
};

KeyValuePair.findSmallestBlockLength = function (wordlength) {
    return Math.ceil(wordlength / spec.blockSize) * spec.blockSize;
};

module.exports = KeyValuePair;