const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

//seed data: some dummy todos - moved into seed/seed.js
// const todos = [{
//     _id: new ObjectID(),
//     text: 'First test todo'
// }, {
//     _id: new ObjectID(),
//     text: 'Second test todo',
//     completed: true,
//     completedAt: 333 //any number you like
// }];
// beforeEach((done) => {
//     //Todo.remove({}).then(() => done()); //this deletes everything
//     //this removes everything and then adds some seed data
//     Todo.remove({}).then(() => {
//         return Todo.insertMany(todos);
//     }).then(() => done());
// });

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        var text = 'Test todo text';

        request(app)
            .post('/todos')
            .send({text})
            .expect(200) //expect is an assertion
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find({text}).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should not create todo with invalid body data', (done) => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch((e) => done(e));
            });
    });
});

describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);
    });
});

describe('GET /todos/:id', () => {
    it('should return todo doc', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it('should return a 404 if todo not found', (done) => {
        // make sure you get a 404 back
        var hexId = new ObjectID().toHexString;
        request(app)
            .get(`/todos/${hexId}`)
            .expect(404) //remember that expect is an assertion
            .end(done);
    });

    it('should return a 404 for non-object ids', (done) => {
        // /todos/123
        request(app)
            .get('/todos/123')
            .expect(404)
            .end(done);
    });
});

// describe('DELETE /todos/:id', () => {
//     it('should remove a todo', (done) => {
//         var hexId = todos[1]._id.toHexString(); //get the second item

//         request(app)
//             .delete(`/todos/${hexId}`)
//             .expect(200) //assertions / expectations
//             .expect((res) => {
//                 expect(res.body.todo._id).toBe(hexId);
//             })
//             .end((err, res) => {
//                 if (err) {
//                     return done(err); //error can be rendered by Mocha
//                 }

//                 // query database using findById and make sure it doesn't exist; use toNotExist
//                 // expect(x).toNotExist();

//                 Todo.findById(hexId).then((todo) => {
//                     expect(todo).toNotExist;
//                     done();
//                 }).catch((e) => done(e));

//             });
//     });

//     it('should return 404 if todo not found', (done) => {
//         // make sure you get a 404 back
//         var hexId = new ObjectID().toHexString;
//         request(app)
//             .delete(`/todos/${hexId}`)
//             .expect(404) //remember that expect is an assertion
//             .end(done);

//     });

//     it('should return 404 if object id is invalid', (done) => {
//         request(app)
//             .delete('/todos/123')
//             .expect(404)
//             .end(done);
//     });
// });

describe('PATCH /todos/:id', () => {
    it('should update the todo', (done) => {
        // grab id of first item
        var hexId = todos[0]._id.toHexString();
        var varText = 'Hello David 2';
        //var completed = true;
        // update text, set completed true
        // now assertions: 200
        // custom assertion: text body is changed, completed is true, completedAt is a number, toBeA
        // SEE documentation for SuperTest

        request(app)
            .patch(`/todos/${hexId}`) //inject the hexID
            //.send({text})
            //.send({completed})
            .send({
                completed: true,
                text: varText
            })
            .expect(200) //assertions / expectations
            .expect((res) => {
                expect(res.body.todo.text).toBe(varText); 
                expect(res.body.todo.completed).toBe(true);
                expect(typeof res.body.todo.completedAt).toBe('number');
            })
            .end(done);
    });

    it('should clear completedAt when todo is not completed', (done) => {
        // grab id of second todo item
        var hexId = todos[1]._id.toHexString(); //get the second item
        var text = 'Hello David 3';
        var completed = false;
        // update the text, set completed to false
        // 200
        // text is changed, completed is false, completedAt is null, eg use toNotExist
        request(app)
            .patch(`/todos/${hexId}`)
            .send({text})
            .send({completed})
            .expect(200) //assertions / expectations
            .expect((res) => {
                expect(res.body.todo.text).toBe('Hello David 3');
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completedAt).toNotExist; //toBe(null);
            })
            .end(done);
    });
});