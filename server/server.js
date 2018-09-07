var express = require('express');
var bodyParser = require('body-parser');
var {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose'); //remember {} uses destructuring
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();
const port = process.env.PORT || 3000; // from Heroku; if not found use 3000

//now we need the post route (CRUD operations)

app.use(bodyParser.json()); //the middleware we need to give to express

app.post('/todos', (req, res) => {
    //console.log(req.body);
    var todo = new Todo({
        text: req.body.text,
        completed: req.body.completed,
        completedAt: req.body.completedAt
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/todos', (req, res) => { //req = request; res = result
    Todo.find().then((todos) => {
        res.send({todos});
    }, (e) => {
        res.status(400).send(e);
    });
});

// GET /todos/12341234 - my version
// app.get('/todos/:id', (req, res) => {
//     var id = req.params.id;

//     if (mongoose.Types.ObjectId.isValid(id)) {
//         Todo.findById(id)
//             .then(
//                 (todo) => {
//                     if (todo === null) {
//                         res.status(404).send();
//                     } else {
//                         res.send({todo});
//                     }
//                 }, (e) => {
//                     res.status(404).send(e);
//                 })
//             .catch((err) => {
//                 res.status(404).send(err);
//             });   
//     } else {
//         res.status(400).send();
//     }


//     // Validate id using isValid
//     // respond with 404 if not valid - send back empty send - a send with no value

//     // findById
//     //  Success Case
//     //    if todo - send it back
//     //    if no todo, call succeeded, but Id not in collection - 404 with empty body
//     //  Error Case
//     //    400 - don't show the error because it might contain private information

//     //res.send(req.params);
// });

// GET /todos/12341234 - Andrew's version
app.get('/todos/:id', (req, res) => {
    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Todo.findById(id)
        .then(
            (todo) => {
                if (!todo) {
                    return res.status(404).send();
                }
                res.send({todo});
            })
        .catch((e) => {
            res.status(400).send();
        });   
});


app.listen(port, () => {
    console.log(`Started up on port ${port}`);
});

module.exports = {app};