const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Todo.remove()
// cannot be empty
// empty remove object deletes everything
// Todo.remove({}).then(result => {

// })

// will also return document
// Todo.findOneAndRemove().then(doc => {

// })

// will also return doc
// Todo.findByIdAndRemove().then(doc => {

// })