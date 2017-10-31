let mongoose = require('mongoose');

mongoose.Promise = global.Promise; // tell mongoose which promise library I want to use
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp'); // connect

module.exports = { mongoose }