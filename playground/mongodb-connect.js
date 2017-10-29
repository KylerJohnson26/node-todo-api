//es6 object destructuring
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if(err)
        return console.log('Unable to connect to MongoDB server.');

    console.log('Connected to MongoDB server');

    // db.collection('Todos').insertOne({
    //     text: "Something to do",
    //     completed: false
    // }, (err, result) => {
    //     if(err)
    //         return console.log('Unable to insert todo', err);

    //     console.log(JSON.stringify(result.ops, undefined, 4));
    // });

    // let insertNewUser = (name, age, location) => {
    //     db.collection('Users').insertOne({
    //         name: name,
    //         age: age,
    //         location: location
    //     }, (err, result) => {
    //         if(err)
    //             return console.log('Could not insert user');
            
    //         console.log(JSON.stringify(result.ops[0]._id.getTimestamp(), undefined, 4));
    //     });
    // }
    // insertNewUser('Kyler Johnson', 27, 'Alpharetta, GA');

    db.close();
});