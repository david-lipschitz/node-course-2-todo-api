const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server, database TodoApp');
    }
    console.log('Connected to MongoDB server');

    // db.collection('Todos').findOneAndUpdate({
    //     _id: new ObjectID('5b7b112cead91551214f4ac8')
    // }, {
    //     $set: { //this is an update operator, Search for mongodb update operators: https://mongodb.github.io/node-mongodb-native/2.2/api/Collection.html#findOneAndUpdate
    //         completed: true
    //     }
    // }, {
    //     returnOriginal: false
    // }).then((result) => {
    //     console.log(result);
    // });

    // https://docs.mongodb.com/manual/reference/operator/update-field/

    db.collection('Users').findOneAndUpdate({
        _id: new ObjectID('5b7af7e8ea43652066e52a4b')
    }, {
        $set: { 
            name: 'David'
        },
        $inc: {
            age: 1 
        }
    }, {
        returnOriginal: false
    }).then((result) => {
        console.log(result);
    });


    // db.close();
});
