var mongoose = require('mongoose');

//mongoose uses callbacks, but we prefer promises, and we need to tell which library we need
//so we will use the built in promise library
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp', {
    useMongoClient: true
});

// save new something

// create a model
// create a Mongoose Model so that Mongoose knows how to store our model
// text, completed, completedAt are attributes or properties

// Todo is a constructor function - so this is now a great Schema for the todo
var Todo = mongoose.model('Todo', {
    text: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Number, // a regular old Unix Timestamp
        default: null
    }
});

// var newTodo = new Todo({
//     text: 'Cook dinner'
// });

// var newTodo = new Todo({
//     text: 'Be a JavaScript expert 1',
//     completed: true,
//     completedAt: 123
// });

// var newTodo = new Todo({
//     text: 'Something to do'
// });


// newTodo.save().then((doc) => {
//     console.log('Saved todo', doc);
//     console.log(JSON.stringify(doc, undefined, 2));
// }, (e) => {
//     console.log('Unable to save todo', e);
// });

// make a new User model, which is saved as a new Users collection
// email, password, username
// just stick with email for now, require, trim, type = string, set min length of 1,
//   do custom validation later that checks that the email is an email

var User = mongoose.model('User', {
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
});

var newUser = new User({ //can also declare user instead of newUser
    email: 'david@mypowerstation.biz'
});

newUser.save().then((doc) => {  // can also use user here
    //console.log('Saved todo', doc);
    console.log('Saved user:\n', JSON.stringify(doc, undefined, 2));
}, (e) => {
    console.log('Unable to save user', e);
});
