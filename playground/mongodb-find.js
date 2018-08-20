const {MongoClient, ObjectID} = require('mongodb'); //destructuring

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server, database ToDoApp');
    }
    console.log('Connected to MongoDB server');

    //access the collection; and find returns a MongoDB cursor, a pointer to those documents; toArray returns a promise, so we can use .then ...; find() returns everything; find({argument(s)}) set up the key value pairs, eg .find({completed: false}).
    // db.collection('Todos').find({
    //     _id: new ObjectID('5b7b037aead91551214f45e9')
    // }).toArray().then((docs) => {
    //     console.log('Todos');
    //     console.log(JSON.stringify(docs, undefined, 2));
    // }, (err) => {
    //     console.log('Unable to fetch todos', err);
    // });

    db.collection('Todos').find().count().then((count) => {
        console.log(`Todos count: ${count}`);
    }, (err) => {
        console.log('Unable to fetch Todos', err);
    });

    db.collection('Users').find({name: 'David'}).toArray().then((docs) => {
        console.log('Users');
        console.log(JSON.stringify(docs, undefined, 2));
    }, (err) => {
        console.log('Unable to fetch Users', err);
    });

    // db.close();
});
