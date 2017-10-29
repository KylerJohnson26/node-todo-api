//es6 object destructuring
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if(err)
        return console.log('Unable to connect to MongoDB server.');

    console.log('Connected to MongoDB server');

    // deleteMany
    // db.collection('Users').deleteMany({name: "Kyler Johnson"}).then( result => {
    //     console.log(result);
    // });

    // deleteOne
    db.collection('Users').deleteOne({
        _id: new ObjectID("59f2a2d48d614d0460ebf00d")
    }).then(result => console.log(result));

    // findOneAndDelete
    //db.collection('Todos').findOneAndDelete({completed: false}).then(result => console.log(result));

    //db.close();
});