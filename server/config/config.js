var env = process.env.NODE_ENV || 'development'; //it is only set on Heroku

if (env === 'development' || env === 'test') {
    //when you fetch a json file it parses it automatically into a JavaScript object
    var config = require('./config.json'); //and this is not checked into GIT!!
    var envConfig = config[env];

    //Object.keys(envConfig) //gets all the keys and returns them as an array
    // and sets up process.env.PORT and process.env.MONGODB_URI
    Object.keys(envConfig).forEach((key) => {
        process.env[key] = envConfig[key];
    });
}

//don't wipe the development database
// if (env === 'development') {
//     process.env.PORT = 3000;
//     //process.env.MONGODB_URI is set here ... TodoApp
// } else if (env === 'test') {
//     process.env.PORT = 3000;
//     //process.env.MONGODB_URI is set here ... TodoAppTest
// }
