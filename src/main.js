"use strict";

var crypto = require('crypto');
var _ = require('lodash');

var options;

function sign(payload) {
    var hmac = crypto.createHmac('sha256', options.secret);
    hmac.update(payload);
    return hmac.digest('base64');
}

function generateToken(payload) {
    payload = new Buffer(JSON.stringify(payload)).toString('base64');
    return payload + '.' + sign(payload)
}

function validateToken(token, cb) {
    var split = token.split('.');
    if (split.length != 2) return false;

    var payload   = split[0];
    var signature = split[1];

    if (signature !== sign(payload)) return false;

    payload = JSON.parse(new Buffer(split[0], 'base64').toString('utf8'));
    return payload;
}

function getTokenPath() {
    return options.path;
}

function initialize(opts) {
    if ( ! opts.secret )  throw new Error('Missing token secret.');
    if ( ! opts.path )    throw new Error('Missing token path.');
    if ( ! opts.restore ) throw new Error('Missing token restore callback.');
    options = opts;

    return function (req, res, next) {
        var token = _.get(req, options.path);
        if ( ! token ) return next();

        var payload = validateToken(token);
        if ( ! payload ) return next();

        options.restore(req, options.path, next);
    }
};

function reset() {
    options = undefined;
};

module.exports = {
    initialize,
    middleware: initialize,
    generateToken,
    generate: generateToken,
    validateToken,
    validate: validateToken,
    getTokenPath,
    path: getTokenPath,
    reset
};
