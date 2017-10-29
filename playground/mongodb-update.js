//es6 object destructuring
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if(err)
        return console.log('Unable to connect to MongoDB server.');

    console.log('Connected to MongoDB server');

    // findOneAndUpdate
    // db.collection('Todos').findOneAndUpdate({
    //     _id: new ObjectID("59f5453a8599e4b6fb72ed55")
    // }, {
    //     $set: {
    //         completed: true
    //     }
    // }, {
    //     returnOriginal: false
    // })
    // .then( result => console.log(JSON.stringify(result, undefined, 4)));

    db.collection('Users').findOneAndUpdate({
        _id: new ObjectID("59f535563ca89f02864fb260")
    }, {
        $set: {
            name: 'Kyler'
        },
        $inc: {
            age: 1
        }
    }, {
        returnOriginal: false
    })
    .then(result => console.log(JSON.stringify(result, undefined, 4)));

    //db.close();
});