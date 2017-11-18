const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [{
    _id: new ObjectID(),
    text: "First test todo",
    completed: true,
    completedAt: 2345
},
{
    _id: new ObjectID(),
    text: "Second test todo",
    completed: false,
    completedAt: 333
}]

// testing lifecycle method
beforeEach(done => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
});

describe('POST /todos', () => {
    it('Should create new todo', done => {
        let text = 'Test todo text';

        request(app)
            .post('/todos')
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

    it('Should not create todo with invalid body data', done => {
        let text = {};

        request(app)
            .post('/todos')
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

    it('Should get all todos', done => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect(res => {
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);
    });
});

describe('GET /todos/:id', () => {

    it('Should return todo doc', done => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect(res => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it('Should return 404 if todo not found', done => {
        let testId = new ObjectID().toHexString(); 
        request(app)
            .get(`/todos/${testId}`)
            .expect(404)
            .end(done);
    });

    it('Should return 404 for non-object ids', done => {
        let testId = '123';
        request(app)
            .get(`/todos/${testId}`)
            .expect(404)
            .end(done);
    });
});

describe('DELETE /todos/:id', () => {

    it('Should delete todo by id', done => {
        request(app)
            .delete(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect(res => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    })

    it('Should return 404 if todo not found', done => {
        let testId = new ObjectID().toHexString();
        request(app)
            .delete(`/todos/${testId}`)
            .expect(404)
            .end(done);
    })

    it('Should return 404 for non-object ids', done => {
        let testId = '123';
        request(app)
            .delete(`/todos/${testId}`)
            .expect(404)
            .end(done);
    })

})

describe('PATCH /todos/:id', () => {

    it('Should update the todo', done => {
        let id = todos[1]._id.toHexString();
        let text = 'Updated request text';

        request(app)
            .patch(`/todos/${id}`)
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

    it('Should clear completedAt when todo is not completed', done => {
        let id = todos[0]._id.toHexString(); 
               
        request(app)
            .patch(`/todos/${id}`)
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