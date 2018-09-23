var mongoose = require('mongoose');

//mongoose uses callbacks, but we prefer promises, and we need to tell which library we need
//so we will use the built in promise library
mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGODB_URI,
    {
        useMongoClient: true
    }
).then(
    () => {}
);

//everything below here was used in the development
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

// new mLab - this was in the development
// let db = {
//     localhost: process.env.MONGODB_URI,
//     mlab: process.env.MONGODB_URI
// };
//mongoose.connect(db.localhost || db.mlab, {

//the next three lines work on Heroku and MLab
// mongoose.connect(db.mlab, {
//     useMongoClient: true
// });

//mongoose.connect(db.localhost || db.mlab, {

//all this was in the development
// mongoose.connect(db.localhost,
//     {
//         useMongoClient: true
//     }
// ).then(
//     () => {},
//     err => 
//     {
//         mongoose.connect(db.mlab,
//             {
//                 useMongoClient: true
//             }
//         );
//     }
// );


module.exports = {mongoose};