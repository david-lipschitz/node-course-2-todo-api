const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

//remove everything
// Todo.remove({}).then((result) => {
//     console.log(result);
// });

//Todo.findOneAndRemove
//Todo.findByIdAndRemove

// Todo.findOneAndRemove({_id: '5b92ca4c26ec0c3c62b30041'}).then((todo) => {
//     console.log(todo);
// });

Todo.findByIdAndRemove('5b92ca4c26ec0c3c62b30041').then((todo) => {
    console.log(todo);
});