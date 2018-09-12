var env = process.env.NODE_ENV || 'development'; //it is only set on Heroku

//don't wipe the development database
if (env === 'development') {
    process.env.PORT = 3000;
    //process.env.MONGODB_URI is set here ... TodoApp
} else if (env === 'test') {
    process.env.PORT = 3000;
    //process.env.MONGODB_URI is set here ... TodoAppTest
}
