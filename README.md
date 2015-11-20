## easy-token

### Stupid simple authentication for your web app.

Get rid of that session store at virtually no cost with easy-token. This library was written with ease and weight in mind, and should be painless to swap out if your authentication requirements surpass it. 

I wrote easy-token after exploring JWT and feeling that the spec was far beyond what my application really needed. If your familiar with JWT, you can view easy-token simply as the `payload` and the `signature` of a JWT, and nothing else.

Here's an example of an express app utilizing easy-token (can be found under examples):

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
  
# Documentation  
## sign (payload:object)  
Signs an arbitrary payload using the secret provided when initializing easy-token.

**payload**: Any plain object.  
  
**Returns**:  
string: Token signature.  

## generateToken (payload:object)  
Generates a token based on the arbitrary payload provided.

**payload**: Any plain object.  
  
**Returns**:  
string: The token.  

## validateToken (token:string)  
Validates a token.

**token**: The token to be validated.  
  
**Returns**:  
object: The token payload. `undefined` if the token is invalid.  

## getTokenPath   
Returns the path where tokens are expected to be found in the `req` object

  
**Returns**:  
string: The path.  

## initialize (opts:object)  
Configures easy-token. Must be called before any usage of the library is meaningful.

**opts**: Options.  
**opts.secret**: Token secret. (required)  
**opts.path**: Path in the `req` object where client tokens are expected to be found. See [`_.get`](https://lodash.com/docs#get). (required)  
**opts.restore**: Callback function to resolve a validated payload. Signature `req, payload, next`. (required)  
  
**Returns**:  
function: Middleware (can be used with express, for example).  

## reset   
Resets easy-token to its original, uninitialized state. Currently used for testing.

  
