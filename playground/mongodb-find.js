//es6 object destructuring
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if(err)
        return console.log('Unable to connect to MongoDB server.');

    console.log('Connected to MongoDB server');

    // db.collection('Todos').find({
    //     _id: new ObjectID('59f29e8bfb418b044a9f975d')
    // }).toArray().then( docs => {
    //     console.log('------Todos------');
    //     console.log(JSON.stringify(docs, undefined, 4));
    // }, err => {
    //     console.log('Unable to fetch Todos', err);
    // })

    // db.collection('Todos').find().count().then( count => {
    //     console.log('------Todos------');
    //     console.log(`Todos count: ${count}`);
    // }, err => {
    //     console.log('Unable to fetch Todos', err);
    // })

    db.collection('Users').find({name: 'Kyler Johnson'}).toArray().then( docs => {
        console.log(JSON.stringify(docs, undefined, 4));
    }, err => {
        if(err)
            console.log('Unable to fetch docs from db.', err);
    })

    //db.close();
});