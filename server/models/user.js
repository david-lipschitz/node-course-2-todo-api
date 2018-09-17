const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

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
    var token = jwt.sign({_id: user._id.toHexString(), access}, process.env.JWT_SECRET).toString();

    //user.tokens.push({access, token}); - doesn't work anymore, so use the next line
    user.tokens = user.tokens.concat([{access, token}]);

    return user.save().then(() => {
        return token;
    });
};

UserSchema.methods.removeToken = function (token) {
    //$pull is a MongoDB operator, that lets you remove items from an array
    var user = this;

    return user.update({
        $pull: {
            tokens: {
                token: token
            }
        }
    });
};

//.statics turns into a Model Method rather than an Instance method
UserSchema.statics.findByToken = function (token) {
    var User = this;
    var decoded; //set as undefined at the moment
    
    //jwt.verify() 
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
        // return new Promise((resolve, reject) => {
        //     reject();
        // }); - can be replaced with the next line
        return Promise.reject();
    }

    //return on the next line allows the called findByToken to be chained and be a promise in teh call from server.js
    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
};

UserSchema.statics.findByCredentials = function (email, password) {
    var User = this;

    return User.findOne({email}).then((user) => {
        if (!user) {
            return Promise.reject();
        }

        //when a user exists we need to check the password
        return new Promise((resolve, reject) => {
            // Use bcrypt.compare to compare password and user.password
            bcrypt.compare(password, user.password, (err,res) => {
                if (res) {
                    resolve(user); //send the user back
                } else {
                    reject(); //reject the promise and send a 400 back
                }
            });
        });
    });
};

UserSchema.pre('save', function (next) {
    var user = this;

    //was the password modified?
    if (user.isModified('password')) {
        // create salt and password hash user.password
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

var User = mongoose.model('User', UserSchema);

module.exports = {User};