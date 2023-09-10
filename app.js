const express = require('express');
const { connectToDb, getDb } = require('./db');
const { ObjectId } = require('mongodb');

//init app and also middleware
const app = express();
app.use(express.json())

//dbConnection
let db;

connectToDb((err) => {
    if(!err){
        app.listen(3000, ()=>{
            console.log("App listening on port 3000")
        });
        db = getDb();
    }
});



//routes
app.get('/books', (req, res)=>{

    const page = req.query.p || 0 //if P doesnt have a value then the default value will be zero
    const bookPerPage = 3

    let books = []

    db.collection('books')
        .find() // the find method return the cursor.
        .sort({ author: 1 })
        .skip(page * bookPerPage)
        .limit(bookPerPage)
        .forEach(book => books.push(book))
        .then(() => {
            res.status(200).json(books)
        })
        .catch(() => {
            res.status(500).json({ error: "Not able to fetch the document" })
        })
        return;


    res.json({mssg: "Welcome to the API"})
});

app.get('/books/:id', (req, res) => {
    const id = new ObjectId(req.params.id)
    
    if(ObjectId.isValid(id)){
        db.collection('books')
            .findOne({_id: id})
            .then(doc => {
                res.status(200).json(doc)
            })
            .catch(err => {
                res.status(500).json({error: "Could not fetch the document"})
            })
        }
        else
        {
            res.status(500).json({error: "Not a valid doc id"})
        }
})


app.get('/', (req, res)=>{
    res.json("Welcome to My API, Go to /books")
});

app.post('/books', (req, res) =>{
    const book = req.body
    
    db.collection('books')
        .insertOne(book)
        .then(result => {
            res.status(201).json(result)
        })
        .catch(err => {
            res.status(500).json({err: "Unable to fetch the data"})
        })
})

app.delete('/books/:id', (req, res) => {
    const id = new ObjectId(req.params.id)

    if(ObjectId.isValid(id)){
        db.collection('books')
            .deleteOne({_id: id})
            .then(result => {
                res.status(200).json(result)
            })
            .catch(err =>{
                res.status(500).json({error: "Unable to delete data"})
            })
        }
    else{
        res.status(500).json({error: "Not a valid document id"})
    } 
    
})

app.patch('/books/:id', (req, res) => {
    const updates = req.body;
    const id = new ObjectId(req.params.id);

    if(ObjectId.isValid(id)){
        db.collection('books')
            .updateOne({_id: id}, {$set: updates})
            .then(result => {
                res.status(200).json(result)
            })
            .catch(err => {
                res.status(500).json({error: "Unable to update data"})
            })
    }
    else{
        res.status(500).json({error: "Not a valid doc id"})
    }
    
})