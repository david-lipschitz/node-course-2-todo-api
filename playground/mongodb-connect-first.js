const MongoClient = require('mongodb').MongoClient;

//for v3, change existing db to client
//for v3, add const db = client.db('TodoApp') after Connected to MongoDB server
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server, database ToDoApp');
    }
    console.log('Connected to MongoDB server');

    // db.collection('Todos').insertOne({
    //     text: 'Something to do',
    //     completed: false
    // }, (err, result) => {
    //     if (err) {
    //         return console.log('Unable to insert todo', err);
    //     }

    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // });

    // Insert new doc into Users {name, age, location}
    db.collection('Users').insertOne({
        name: 'David',
        age: 54,
        location: 'Cape Town'
    }, (err, result) => {
        if (err) {
            return console.log('Unable to insert user', err);
        }

        console.log(JSON.stringify(result.ops, undefined, 2));
        console.log(result.ops[0]._id);
        console.log(result.ops[0]._id.getTimestamp());
    });

    db.close();
});
