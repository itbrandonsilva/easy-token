"use strict";

var assert = require('assert');

var token = require('../src/main.js');
var payload = {my: 'payload'};

describe('easy-token', function () {
    describe('initialize', function () {
        beforeEach(function () { token.reset(); });

        it('should throw if a secret is not provided', function () {
            assert.throws(function () {
                token.initialize({path: 'token', restore: true});
            }, /secret/);
        });

        it('should throw if a path is not provided', function () {
            assert.throws(function () {
                token.initialize({secret: 'secret', restore: true});
            }, /path/);
        });

        it('should throw if a restore callback is not provided', function () {
            assert.throws(function () {
                token.initialize({secret: 'secret', path: 'token'});
            }, /restore/);
        });
    });

    describe('generateToken', function () {
        beforeEach(function () {
            token.initialize({secret: 'secret', path: 'token', restore: true});
        });

        it('should return a token string with a payload and a signature (dot seperated)', function () {
            var split = token.generate(payload).split('.');
            assert.equal(split.length, 2);
            return true;
        });
    });

    describe('validateToken', function () {
        beforeEach(function () {
            token.initialize({secret: 'secret', path: 'token', restore: true});
        });

        it('should return the payload when a token validates successfully', function () {
            var validated = token.validate(token.generate(payload));
            assert(!!validated);
        });

        it('should return false when a token fails to validate', function () {
            var validated = token.validate('qwedkmvcncmnv.qwioeq');
            assert(!validated);
        });
    });
});
