const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// let id = '59f6903e0c65d6a00dfcea54';

// if(!ObjectID.isValid(id))
//     console.log('ID not valid');

// Todo.find({
//     _id: id //mongoose can convert string into ObjectID
// }).then(todos => {
//     console.log('Todos', todos);
// });

// Todo.findOne({
//     _id: id
// }).then(todo => {
//     console.log('Todo', todo);
// });

// Todo.findById(id)
//     .then(todo => console.log('Todo by id', todo))
//     .catch(err => {})

let id = '59f671be9cbd2dcb06028687';

User.findById(id)
    .then(user => {
        if(!user)
            return console.log('User not found');
        console.log('User: ', user)
    })
    .catch(err => console.log(err));