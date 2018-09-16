require('./config/config');

const _ = require('lodash'); // note Andrew has v4.15.0; I have 4.17/10
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose'); //remember {} uses destructuring
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT; /// || 3000; // from Heroku; if not found use 3000 (now see PORT set above)

//now we need the post route (CRUD operations)

app.use(bodyParser.json()); //the middleware we need to give to express

app.post('/todos', (req, res) => {
    //console.log(req.body);
    var todo = new Todo({
        text: req.body.text,
        completed: req.body.completed,
        completedAt: req.body.completedAt
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/todos', (req, res) => { //req = request; res = result
    Todo.find().then((todos) => {
        res.send({todos});
    }, (e) => {
        res.status(400).send(e);
    });
});

// GET /todos/12341234 - my version
// app.get('/todos/:id', (req, res) => {
//     var id = req.params.id;

//     if (mongoose.Types.ObjectId.isValid(id)) {
//         Todo.findById(id)
//             .then(
//                 (todo) => {
//                     if (todo === null) {
//                         res.status(404).send();
//                     } else {
//                         res.send({todo});
//                     }
//                 }, (e) => {
//                     res.status(404).send(e);
//                 })
//             .catch((err) => {
//                 res.status(404).send(err);
//             });   
//     } else {
//         res.status(400).send();
//     }


//     // Validate id using isValid
//     // respond with 404 if not valid - send back empty send - a send with no value

//     // findById
//     //  Success Case
//     //    if todo - send it back
//     //    if no todo, call succeeded, but Id not in collection - 404 with empty body
//     //  Error Case
//     //    400 - don't show the error because it might contain private information

//     //res.send(req.params);
// });

// GET /todos/12341234 - Andrew's version
app.get('/todos/:id', (req, res) => {
    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Todo.findById(id)
        .then(
            (todo) => {
                if (!todo) {
                    return res.status(404).send();
                }
                res.send({todo});
            })
        .catch((e) => {
            res.status(400).send();
        });   
});

app.delete('/todos/:id', (req, res) => {
    // get the id

    // validate the id -> not valid? return 404

    // remove todo by id
    //   success
    //     if no doc, send 404
    //       if doc, send doc back with a 200
    //   error
    //     400 with empty body

    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Todo.findByIdAndRemove(id)
        .then(
            (todo) => {
                if (!todo) {
                    return res.status(404).send();
                }
                res.send({todo});
            })
        .catch((e) => {
            res.status(400).send(e);
        });   
    
});

app.patch('/todos/:id', (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']); //the reason lodash was added; text and completed are what we are expecting

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    //check the completed value and set it or unset it
    if (_.isBoolean(body.completed) && body.completed) {
        // true
        body.completedAt = new Date().getTime();
    } else {
        // not a boolean or not true
        body.completed = false;
        body.completedAt = null;
    }

    //now update the database
    Todo.findByIdAndUpdate(id, {$set: body}, {new: true})
        .then((todo) => {
            if (!todo) {
                return res.status(404).send();
            }

            res.send({todo});
        })
        .catch((e) => {
            res.status(400).send();
        });


});

app.get('/users', (req, res) => { //req = request; res = result
    User.find().then((users) => {
        res.send({users});
    }, (e) => {
        res.status(400).send(e);
    });
});


// POST /users, like post todos; use pick to fetch the email and password
//  pass to the constructor function directly
app.post('/users', (req, res) => {
    //console.log(req.body);
    var body = _.pick(req.body, ['email', 'password']);
    // var user = new User({ //I did it like this, but there is an easier way
    //     email: body.email,
    //     password: body.password
    // });
    var user = new User(body); //simpler as body will include email and password

    user.save()
        .then(() => { //we used to have .then((user)), but as user is the same we don't need it
            return user.generateAuthToken();
            //res.send(doc); - this was the old line before generateAuthToken and the extra then
        }).then((token) => { // this then is a second promise
            res.header('x-auth', token).send(user);
        })
        .catch((e) => {
            res.status(400).send(e);
        });
});

// authenticate was then moved to its own file in middleware/authenticate.js
// //the middleware function that allows us to make our routes private
// var authenticate = (req, res, next) => {
//     var token = req.header('x-auth');

//     User.findByToken(token) //See user.js
//         .then((user) => {
//             if (!user) {
//                 return Promise.reject();  // instead of "res.status(401).send();"" so that the catch is called
//             }

//             //use the modified request object
//             req.user = user;
//             req.token = token;
//             next(); //if we don't call this, then the call to authenticate won't execute
//         })
//         .catch((e) => {
//             res.status(401).send();
//         });
// };

//this one is with authenticate
app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

// //this one is without authenticate
// app.get('/users/me', (req, res) => {
//     var token = req.header('x-auth');

//     User.findByToken(token) //See user.js
//         .then((user) => {
//             if (!user) {
//                 return Promise.reject();  // instead of "res.status(401).send();"" so that the catch is called
//             }

//             res.send(user);
//         })
//         .catch((e) => {
//             res.status(401).send();
//         });
// });

// now we need to allow a user to login, the user exists, and has valid (hashed) password
// POST /users/login {email, password}
app.post('/users/login', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    
    //res.send(body);
    User.findByCredentials(body.email, body.password).then((user) => {
        //res.send(user); -- during testing and before adding generateAuthToken
        user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user);
        });
    }).catch((e) => {
        res.status(400).send();
    });

});

app.listen(port, () => {
    console.log(`Started up on port ${port}`);
});

module.exports = {app};