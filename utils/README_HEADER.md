## easy-token

### Stupid simple authentication for your web app.

Get rid of that session store at virtually no cost with easy-token. This library was written with ease and weight in mind, and should be painless to swap out if your authentication requirements surpass it. 

I wrote easy-token after exploring JWT and feeling that the spec was far beyond what my application really needed. If your familiar with JWT, you can view easy-token simply as the `payload` and the `signature` of a JWT, and nothing else.

Here's an example of an express app utilizing easy-token (can be found under examples):

