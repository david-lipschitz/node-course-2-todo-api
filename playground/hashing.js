const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = '123abc!';

// bcrypt.genSalt(10, (err, salt) => {
//     bcrypt.hash(password, salt, (err, hash) => {
//         console.log(hash);
//     });
// });

var hashedPassword = '$2a$10$.ReIxSBrKgo912WAL4YBWOkKCeT9K7Fqwossd/5.ng7IGMnYhSP9G';

bcrypt.compare(password, hashedPassword, (err, res) => {
    console.log(res);
});

// //jwt testing

// var data = {
//     id: 10
// };

// var token = jwt.sign(data, '123abc');
// console.log(token);
// //can check the token at https://jwt.io/
// var decoded = jwt.verify(token, '123abc');
// console.log('decoded', decoded);

// //jwt testing till here

//the following code used if we don't use jwt

// var message = 'I am user number 3';
// var hash = SHA256(message).toString(); //toString becasue the SHA256 result is an Object

// console.log(`Message: ${message}`);
// console.log(`Hash: ${hash}`);

// //everything from here can be done with JWS, JSON Web Token
// var data = {
//     id: 4
// };
// var token = {
//     //data: data // ES6 is data only
//     data,
//     hash: SHA256(JSON.stringify(data) + 'somesecret').toString() //somesecret is the salt, which is only on the server
// };

// //someone tries to manipulate
// // token.data.id = 5;
// // token.hash = SHA256(JSON.stringify(token.data)).toString();

// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();
// if (resultHash === token.hash) {
//     console.log('Data was not changed');
// } else {
//     console.log('Data was changed. Do not trust!');
// }