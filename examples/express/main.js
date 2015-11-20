"use strict";

var express = require('express');
var app = express();

var token = require('../../index.js');
var cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use(token.initialize({
    secret: 't3hs3cr3t',
    path: 'cookies.token',
    restore: function (req, payload, next) {
        // Make whatever requests you need to make to the db here
        req.user = payload;
        next();
    }
}));

app.get('/', function (req, res) {
    res.send('Hello world');
});

app.get('/login', function (req, res) {
    res.cookie('token', token.generate({name: 'Brandon'}));
    res.send('You are now logged in!');
});

app.get('/logout', function (req, res) {
    res.clearCookie('token');
    res.send('You are now logged out!');
});

app.get('/secure', function (req, res) {
    if ( ! req.user ) return res.send('You are not authorized to access this endpoint!');
    res.send('Welcome to the secure endpoint, ' + req.user.name + '!');
});

app.listen(3000, function () {
    console.log('Listening...');
});
