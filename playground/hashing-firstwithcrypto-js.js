const {SHA256} = require('crypto-js');

var message = 'I am user number 3';
var hash = SHA256(message).toString(); //toString becasue the SHA256 result is an Object

console.log(`Message: ${message}`);
console.log(`Hash: ${hash}`);

//everything from here can be done with JWS, JSON Web Token
var data = {
    id: 4
};
var token = {
    //data: data // ES6 is data only
    data,
    hash: SHA256(JSON.stringify(data) + 'somesecret').toString() //somesecret is the salt, which is only on the server
};

//someone tries to manipulate
// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(token.data)).toString();

var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();
if (resultHash === token.hash) {
    console.log('Data was not changed');
} else {
    console.log('Data was changed. Do not trust!');
}