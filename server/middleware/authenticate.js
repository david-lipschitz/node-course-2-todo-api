var {User} = require('./../models/user');

//the middleware function that allows us to make our routes private
var authenticate = (req, res, next) => {
    var token = req.header('x-auth');

    User.findByToken(token) //See user.js
        .then((user) => {
            if (!user) {
                return Promise.reject();  // instead of "res.status(401).send();"" so that the catch is called
            }

            //use the modified request object
            req.user = user;
            req.token = token;
            next(); //if we don't call this, then the call to authenticate won't execute
        })
        .catch((e) => {
            res.status(401).send();
        });
};

module.exports = {authenticate};