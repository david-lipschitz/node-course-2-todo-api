/* eslint-env mocha*/
//https://github.com/mjackson/expect

const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
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
            .set('x-auth', users[0].tokens[0].token)
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
            .set('x-auth', users[0].tokens[0].token)
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
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(1);
            })
            .end(done);
    });
});

describe('GET /todos/:id', () => {
    it('should return todo doc', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it('should not return todo doc created by another user', (done) => {
        request(app)
            .get(`/todos/${todos[1]._id.toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it('should return a 404 if todo not found', (done) => {
        // make sure you get a 404 back
        var hexId = new ObjectID().toHexString;
        request(app)
            .get(`/todos/${hexId}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404) //remember that expect is an assertion
            .end(done);
    });

    it('should return a 404 for non-object ids', (done) => {
        // /todos/123
        request(app)
            .get('/todos/123')
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });
});

describe('DELETE /todos/:id', () => {
    it('should remove a todo', (done) => {
        var hexId = todos[1]._id.toHexString(); //get the second item

        request(app)
            .delete(`/todos/${hexId}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(200) //assertions / expectations
            .expect((res) => {
                expect(res.body.todo._id).toBe(hexId);
            })
            .end((err, res) => {
                if (err) {
                    return done(err); //error can be rendered by Mocha
                }

                // query database using findById and make sure it doesn't exist; use toNotExist
                // expect(x).toNotExist();

                Todo.findById(hexId).then((todo) => {
                    expect(todo).toBeFalsy();
                    done();
                }).catch((e) => done(e));

            });
    });

    it('should not remove a todo for another user', (done) => {
        var hexId = todos[0]._id.toHexString(); //get the second item

        request(app)
            .delete(`/todos/${hexId}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(404) //assertions / expectations
            .end((err, res) => {
                if (err) {
                    return done(err); //error can be rendered by Mocha
                }

                // query database using findById and make sure it doesn't exist; use toNotExist
                // expect(x).toNotExist();

                Todo.findById(hexId).then((todo) => {
                    expect(todo).toBeTruthy();
                    done();
                }).catch((e) => done(e));

            });
    });

    it('should return 404 if todo not found', (done) => {
        // make sure you get a 404 back
        var hexId = new ObjectID().toHexString;
        request(app)
            .delete(`/todos/${hexId}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(404) //remember that expect is an assertion
            .end(done);

    });

    it('should return 404 if object id is invalid', (done) => {
        request(app)
            .delete('/todos/123')
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)
            .end(done);
    });
});

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

        // auth as first user
        request(app)
            .patch(`/todos/${hexId}`) //inject the hexID
            .set('x-auth', users[0].tokens[0].token)
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

    it('should not update the todo created by other user', (done) => {
        // grab id of first item
        var hexId = todos[0]._id.toHexString();
        var varText = 'Hello David 2';
        request(app)
            .patch(`/todos/${hexId}`) //inject the hexID
            .set('x-auth', users[1].tokens[0].token)
            .send({
                completed: true,
                text: varText
            })
            .expect(404)
            .end(done);
    });


    // duplicate above test
    // try to update first todo as second user
    // assert 404 response

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
            .set('x-auth', users[1].tokens[0].token)
            .send({text})
            .send({completed})
            .expect(200) //assertions / expectations
            .expect((res) => {
                expect(res.body.todo.text).toBe('Hello David 3');
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completedAt).toBeFalsy(); //toBe(null);
            })
            .end(done);
    });
});

describe('GET /users/me', () => {
    it('should return user if authenticated', (done) => {
        //using SuperTest for request(app)
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token) //set the header
            .expect(200)
            //expect some things about the body that comes back; (res) => is a custom expect function
            .expect((res) => {
                //add assertions
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done);
    });
    it('should return a 401 if not authenticated', (done) => {
        //make sure random data isn't returned
        //expect 401 and make sure body is empty, using toEqual, not toBe
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({}); //check all the properties
            })
            .end(done);
    });
});

describe('POST /users', () => {
    it('should create a user', (done) => {
        var email = 'example@example.com';
        var password = '123mnb!';

        request(app)
            .post('/users')
            .send({email, password})
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeTruthy();
                expect(res.body._id).toBeTruthy();
                expect(res.body.email).toBe(email);
            })
            //.end(done); // or we can check the results using the following
            .end((err) => {
                if (err) {
                    return done(err);
                }

                User.findOne({email}).then((user) => {
                    expect(user).toBeTruthy();
                    expect(user.password).not.toBe(password); //should be hashed therefore different
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should return validation errors if request invalid', (done) => {
        //send an invalid email and an invalid password
        //expect 400
        var email = 'email';
        var password = 'pass';

        request(app)
            .post('/users')
            .send({email, password})
            .expect(400)
            //.end(done);
            .end(function (err, res) {
                if (err) {
                    return done(err);
                    //throw err;
                }
                console.log(res.body.errors.password.message);
                console.log(res.body.errors.email.message);
                done(); //res.body.errors.password.message);
            });
    });

    it('should not create user if email in use', (done) => {
        //use and email from the seed data; expect 400
        request(app)
            .post('/users')
            .send({
                email: users[0].email, 
                password: 'password1'
            })
            .expect(400)
            .end(done);
    });
});

describe('POST /users/login', () => {
    it('should login user and return auth token', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: users[1].password
            })
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeTruthy();
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                //find the user
                User.findById(users[1]._id).then((user) => {
                    //expect(user.toObject().tokens[1]).toMatchObject({access, })
                    expect(user.tokens[1]).toHaveProperty('access', 'auth');
                    expect(user.tokens[1]).toHaveProperty('token', res.headers['x-auth']);
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should reject invalid login', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: 'pass'
            })
            .expect(400)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeFalsy();
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                //find the user
                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens.length).toBe(1);
                    done();
                }).catch((e) => done(e));
            });
    });
});

//verify that when we send a token it is removed

describe('DELETE /users/me/token', () => {
    it('should remove auth token on logout', (done) => {
        // DELETE /users/me/token
        // Set x-auth equal to token
        // Assertions
        // 200
        // Find user, verify that tokens array has length of zero

        //console.log(users[0].tokens[0].token);

        request(app)
            .delete('/users/me/token')
            .set('x-auth', users[0].tokens[0].token) //set the header
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err); //error can be rendered by Mocha
                }

                // query database using findById and make sure it doesn't exist; use toNotExist
                // expect(x).toNotExist();

                User.findById(users[0]._id).then((user) => {
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch((e) => done(e));
            });
    });
});