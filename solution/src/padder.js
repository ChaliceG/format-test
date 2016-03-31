var Padder = function (wordLength) {
    this.wordLength = wordLength;
}

Padder.prototype.pad = function (toPad) {
    return toPad;
};

module.exports = Padder;