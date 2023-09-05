const express = require('express');
const { connectToDb, getDb } = require('./db');

//init app and also middleware
const app = express();

//dbConnection
let db;

connectToDb(() => {
    if(!err){
        app.listen(3000, ()=>{
            console.log("App listening on port 3000")
        });
        db = getDb();
    }
});



//routes
app.get('/books', (req, res)=>{

    let books = [];

    db.collection('books')
        .find() // the find method return the cursor.
        .sort({ author: 1 })
        .forEach(book => books.push(book))
        .then(() => {
            res.status(200).json(books)
        })
        .catch(() => {
            res.status(500).json({ error: "Not able to fetch the document" })
        })


    res.json({mssg: "Welcome to the API"})
});

app.get('/', (req, res)=>{
    res.json("Welcome to My API, Go to /books")
});