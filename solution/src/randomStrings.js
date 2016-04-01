var crypto = require('crypto');

module.exports = {
    alphanumeric: function (length) {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for( var i=0; i < length; i++ ) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        return text;
    },
    cryptoRandom: function (length) {
        return crypto.randomBytes(length);
    }
};