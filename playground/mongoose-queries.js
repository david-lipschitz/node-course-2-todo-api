const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
//const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// var id = '5b842c25d752c74dcb09cd34';

// if (!ObjectID.isValid(id)) {
//     console.log('ID not valid');
// }


// Todo.find({
//     _id: id
// }).then((todos) => {
//     console.log('Todos', todos);
// });

// Todo.findOne({
//     _id: id
// }).then((todo) => {
//     console.log('Todo', todo);
// });

// Todo.findById(id).then((todo) => {
//     if (!todo) {
//         return console.log('Id not found');
//     }
//     console.log('Todo By Id', todo);
// }).catch((e) => console.log(e));

//query the Users collection
//load in the user mongoose model
//User.findById: 1) User not found; 2) User is found; 3) Errors that occured

var userid = '5b83f9b02d02063518b5c2dd';

User.findById(userid).then((user) => {
    if (!user) {
        return console.log('Unable to find user');
    }

    console.log('User by Id', JSON.stringify(user, undefined, 2));
}, (e) => {
    console.log(e);
});