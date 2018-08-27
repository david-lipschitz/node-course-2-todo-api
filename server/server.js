var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose'); //remember {mongoose} uses destructuring
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();

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

app.listen(3000, () => {
    console.log('Started on port 3000');
});

module.exports = {app};