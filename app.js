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
    res.json({mssg: "Welcome to the API"})
});

app.get('/', (req, res)=>{
    res.json("Welcome to My API, Go to /books")
});