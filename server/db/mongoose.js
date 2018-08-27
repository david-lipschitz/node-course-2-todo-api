var mongoose = require('mongoose');

//mongoose uses callbacks, but we prefer promises, and we need to tell which library we need
//so we will use the built in promise library
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp', {
    useMongoClient: true
});

module.exports = {mongoose};