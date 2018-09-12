const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

// {
//     email: validated, 
//     password: 'myPass123', // user sends in plain text; but store it securely; hash it with bCrypt algorithm; we can hash it but we can't unhash it
//     tokens: [{
//         //an array of authentication tokens
//         access: 'auth', //token types, eg auth and reset passwords
//         token: 'dkajfsdlkjasdefj' // when a user wants to send a secure request, the user sends this token
//     }]
// }

//we use this Schema constructor function for adding more functions & objects
var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        unique: true, //can't have two documents with the same email address
        // validate: { 
        //     validator: (value) => { //use npm validator - this is one way to do it
        //         return validator.isEmail(value);
        //     },
        //     message: '{VALUE} is not a valid email'
        // }
        validate: {
            isAsync: true,
            validator: validator.isEmail, //this is simpler, and doesn't need a custom function
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        require: true,
        minlength: 6
    },
    tokens: [{ //mongoose allows this but not PostGres
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

//UserSchema.methods // is an object, these are instance methods
//  Arrow functions do not Bind a THIS keyword, so we need a function () type function

//here we override what properties are returned
UserSchema.methods.toJSON = function () {
    var user = this;
    var userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email']); //this means that the password and tokens array are not returned 
};

UserSchema.methods.generateAuthToken = function () {
    var user = this; // eg use this
    var access = 'auth';
    var token = jwt.sign({_id: user._id.toHexString(), access}, 'david123').toString();

    //user.tokens.push({access, token}); - doesn't work anymore, so use the next line
    user.tokens = user.tokens.concat([{access, token}]);

    return user.save().then(() => {
        return token;
    });
};

var User = mongoose.model('User', UserSchema);

module.exports = {User};