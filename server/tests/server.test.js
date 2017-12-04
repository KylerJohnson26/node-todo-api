const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

// testing lifecycle method
beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
    it('should create new todo', done => {
        let text = 'Test todo text';

        request(app)
            .post('/todos')
            .set('x-auth', users[0].tokens[0].token)
            .send({text})
            .expect(200)
            .expect(res => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if(err)
                    return done(err);
                
                Todo.find({text}).then(todos => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch(err => done(err));
            })
    });

    it('should not create todo with invalid body data', done => {
        let text = {};

        request(app)
            .post('/todos')
            .set('x-auth', users[0].tokens[0].token)            
            .send({text})
            .expect(400)
            .end((err, res) => {
                if(err)
                    return done(err);

                Todo.find().then(todos => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch(err => done(err));
            });
    });
});

describe('GET /todos', () => {

    it('should get all todos', done => {
        request(app)
            .get('/todos')
            .set('x-auth', users[0].tokens[0].token)            
            .expect(200)
            .expect(res => {
                expect(res.body.todos.length).toBe(1);
            })
            .end(done);
    });
});

describe('GET /todos/:id', () => {

    it('should return todo doc', done => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect(res => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it('should return 404 if todo not found', done => {
        let testId = new ObjectID().toHexString(); 
        request(app)
            .get(`/todos/${testId}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it('should return 404 for non-object ids', done => {
        let testId = '123';
        request(app)
            .get(`/todos/${testId}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it('should not return todo doc created by other', done => {
        request(app)
            .get(`/todos/${todos[1]._id.toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });
});

describe('DELETE /todos/:id', () => {
    
    it('should delete todo by id', done => {
        let testId = todos[0]._id.toHexString();
        request(app)
            .delete(`/todos/${testId}`)
            .set('x-auth', users[1].tokens[0].token)            
            .expect(200)
            .expect(res => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end((err, res) => {
                if(err)
                    return done(err)
                
                Todo.findById(testId).then(todo => {
                    expect(todo).toNotExist();
                    done();
                }).catch(err => done(err));
            });
    })

    it('should not delete todo if created by another', done => {
        let testId = todos[1]._id.toHexString();
        request(app)
            .delete(`/todos/${testId}`)
            .set('x-auth', users[0].tokens[0].token)            
            .expect(404)
            .expect(res => {
                expect(res.body.todo).toNotExist();
            })
            .end((err, res) => {
                if(err)
                    return done(err)
                
                Todo.findById(testId).then(todo => {
                    expect(todo).toExist();
                    done();
                }).catch(err => done(err));
            });
    })

    it('should return 404 if todo not found', done => {
        let testId = new ObjectID().toHexString() + '1';
        request(app)
            .delete(`/todos/${testId}`)
            .set('x-auth', users[0].tokens[0].token)                        
            .expect(404)
            .end(done);
    })

    it('should return 404 for non-object ids', done => {
        let testId = '123';
        request(app)
            .delete(`/todos/${testId}`)
            .set('x-auth', users[0].tokens[0].token)                        
            .expect(404)
            .end(done);
    })

})

describe('PATCH /todos/:id', () => {

    it('should update the todo', done => {
        let id = todos[1]._id.toHexString();
        let text = 'Updated request text';

        request(app)
            .patch(`/todos/${id}`)
            .set('x-auth', users[0].tokens[0].token)                                    
            .send({
                completed: true,
                text: text,
                completedAt: 876
            })
            .expect(200)
            .expect(res => {
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(true);
                expect(res.body.todo.completedAt).toBeA('number');
            })
            .end(done);
    })

    it('should clear completedAt when todo is not completed', done => {
        let id = todos[0]._id.toHexString(); 

        request(app)
            .patch(`/todos/${id}`)
            .set('x-auth', users[0].tokens[0].token)                                    
            .send({
                completed: false
            })
            .expect(200)
            .expect(res => {
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completedAt).toBe(null);
            })
            .end(done);
    });

});

describe('POST /users', () => {
    it('should create a user', done => {
        let email = 'example@example.com';
        let password = '123mnb';

        request(app)
            .post('/users')
            .send({email, password})
            .expect(200)
            .expect(res => {
                expect(res.headers['x-auth']).toExist();
                expect(res.body._id).toExist();
                expect(res.body.email).toBe(email);
            })
            .end(err => {
                if(err)
                    return done(err)

                User.findOne({email}).then(user => {
                    expect(user).toExist();
                    expect(user.password).toNotBe(password);
                    done();
                }).catch(err => done(err));
            });
    });

    it('should return validation errors if request invalid', done => {
        request(app)
            .post('/users')
            .send({
                email: 'and',
                password: '123'
            })
            .expect(400)
            .end(done);
    })
});

describe('GET /users/me', () => {

    it('should return user if authenticated', done => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect(res => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done);
    })

    it('should return a 401 if not authenticated', done => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect(res => {
                expect(res.body).toEqual({});
            })
            .end(done);
    });
});

describe('POST /users/login', () => {
    it('should login user and return auth token', done => {
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: users[1].password
            })
            .expect(200)
            .expect(res => {
                expect(res.headers['x-auth']).toExist();
            })
            .end((err, res) => {
                if(err)
                    return done(err);
                
                User.findById(users[1]._id).then(user => {
                    expect(user.tokens[1]).toInclude({
                        access: 'auth',
                        token: res.headers['x-auth']
                    });
                    done();
                }).catch(err => done(err));
            })
    });

    it('should reject invalid login', done => {
        request(app)
        .post('/users/login')
        .send({
            email: users[1].email,
            password: users[0].password
        })
        .expect(400)
        .expect(res => {
            expect(res.headers['x-auth']).toNotExist();
        })
        .end((err, res) => {
            if(err)
                return done(err);
            
            User.findById(users[1]._id).then(user => {
                expect(user.tokens.length).toBe(1);
                done();
            }).catch(err => done(err));
        })
    });
});

describe('DELETE /users/me/token', () => {
    it('should logout user by deleting token object', done => {
        request(app)
            .delete('/users/me/token')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect(res => {
                expect(res.headers['x-auth']).toNotExist();
            })
            .end((err, res) => {
                if(err)
                    return done(err);
                
                User.findById(users[0]._id).then(user => {
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch(err => done(err));
            })            
    });

    it('should reject non-authenticated users', done => {
        request(app)
            .delete('/users/me/token')
            .expect(401)
            .expect(res => {
                expect(res.headers['x-auth']).toNotExist();
            })
            .end(done);
    });
});
