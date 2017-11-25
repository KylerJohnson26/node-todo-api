const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [{
    _id: userOneId,
    email: 'kyler@example.com',
    password: 'userOnePassword',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userOneId, access: 'auth'}, 'abc123').toString()
    }]
}, {
    _id: userTwoId,
    email: 'abbey@example.com',
    password: 'userTwoPassword'
}];

const todos = [{
    _id: new ObjectID(),
    text: "First test todo",
    completed: true,
    completedAt: 2345,
    _creator: userOneId
},
{
    _id: new ObjectID(),
    text: "Second test todo",
    completed: false,
    completedAt: 333,
    _creator: userTwoId
}];

const populateUsers = done => {
    User.remove({}).then(() => {
        let userOne = new User(users[0]).save();
        let userTwo = new User(users[1]).save();
        // waits on both promises from above saves
        return Promise.all([userOne, userTwo]);
    }).then(() => done());
};

const populateTodos = done => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
};

module.exports = { todos, populateTodos, users, populateUsers };