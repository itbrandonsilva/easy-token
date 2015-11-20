"use strict";

var crypto = require('crypto');
var _ = require('lodash');

var options;

/**
 * Signs an arbitrary payload using the secret provided when initializing easy-token.
 * @function
 * @param {object} payload - Any plain object.
 * @returns {string} Token signature.
 */

function sign(payload) {
    var hmac = crypto.createHmac('sha256', options.secret);
    hmac.update(payload);
    return hmac.digest('base64');
}

/**
 * Generates a token based on the arbitrary payload provided.
 * @function
 * @param {object} payload - Any plain object.
 * @returns {string} The token.
 */

function generateToken(payload) {
    payload = new Buffer(JSON.stringify(payload)).toString('base64');
    return payload + '.' + sign(payload)
}

/**
 * Validates a token.
 * @function
 * @param {string} token - The token to be validated.
 * @returns {object} The token payload. `undefined` if the token is invalid.
 */

function validateToken(token) {
    var split = token.split('.');
    if (split.length != 2) return undefined;

    var payload   = split[0];
    var signature = split[1];

    if (signature !== sign(payload)) return undefined;

    payload = JSON.parse(new Buffer(split[0], 'base64').toString('utf8'));
    return payload;
}

/**
 * Returns the path where tokens are expected to be found in the `req` object
 * @function
 * @returns {string} The path.
 */

function getTokenPath() {
    return options.path;
}

/**
 * Configures easy-token. Must be called before any usage of the library is meaningful.
 * @function
 * @param {object} opts - Options.
 * @param {string} opts.secret - Token secret. (required)
 * @param {string} opts.path - Path in the `req` object where client tokens are expected to be found. See [`_.get`](https://lodash.com/docs#get). (required)
 * @param {function} opts.restore - Callback function to resolve a validated payload. Signature `req, payload, next`. (required)
 * @returns {function} Middleware (can be used with express, for example).
 */

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

        options.restore(req, payload, next);
    }
};

/**
 * Resets easy-token to its original, uninitialized state. Currently used for testing.
 * @function
 * @private
 */

function reset() {
    options = undefined;
};

module.exports = {
    initialize: initialize,
    middleware: initialize,
    generateToken: generateToken,
    generate: generateToken,
    validateToken: validateToken,
    validate: validateToken,
    getTokenPath: getTokenPath,
    path: getTokenPath,
    sign: sign,
    reset: reset
};
