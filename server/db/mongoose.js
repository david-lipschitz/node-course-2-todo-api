var mongoose = require('mongoose');

//mongoose uses callbacks, but we prefer promises, and we need to tell which library we need
//so we will use the built in promise library
mongoose.Promise = global.Promise;
// original local db for testing
// mongoose.connect('mongodb://localhost:27017/TodoApp', {
//     useMongoClient: true
// });

//var env = process.env.NODE_ENV || 'development';

// var localhostDB = '';

// if (env === 'development') {
//     localhostDB =  'mongodb://localhost:27017/TodoApp';
// } else {
//     localhostDB = 'mongodb://localhost:27017/TodoAppTest';
// }

///var config = require('./configmongoose.json'); //and this is not checked into GIT!!
///var envConfig = config;
///Object.keys(envConfig).forEach((key) => {
///    process.env[key] = envConfig[key];
///});

// new mLab
let db = {
    localhost: process.env.MONGODB_URI,
    mlab: 'mongodb://davidl:#G2KgR.7kDFsKgyJ@ds249092.mlab.com:49092/mpst-mongodb-sandbox-todo-api' ///process.env.MLAB
};
//mongoose.connect(db.localhost || db.mlab, {

//the next three lines work on Heroku and MLab
// mongoose.connect(db.mlab, {
//     useMongoClient: true
// });

//mongoose.connect(db.localhost || db.mlab, {

mongoose.connect(db.localhost,
    {
        useMongoClient: true
    }
).then(
    () => {},
    err => 
    {
        mongoose.connect(db.mlab,
            {
                useMongoClient: true
            }
        );
    }
);


module.exports = {mongoose};