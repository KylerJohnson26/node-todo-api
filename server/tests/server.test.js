const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

// testing lifecycle method
beforeEach(done => {
    Todo.remove({}).then(() => done());
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
                
                Todo.find().then(todos => {
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
                    expect(todos.length).toBe(0);
                    done();
                }).catch(err => done(err));
            })
    })
})