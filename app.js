const express=require("express")
const morgan = require('morgan')

const { ObjectId } = require("mongodb")

const {connectToDb , getDb} =require('./db')

//init app and middleware 
const app=express()
app.use(express.json())
app.use(morgan('combined'))

//db connection 
let db

connectToDb((err)=>{
    if(!err){
        app.listen(3000,()=>{
            console.log('app listening on port 3000');
        }) 

        db=getDb()
    }
})





//routes 

app.get('/books',(req,res)=>{
    const page = req.query.p || 0
    const booksPerPage=3 
    
    let books=[]

    db.collection('books')
    .find()
    .sort({author:1})
    .skip(page*booksPerPage)
    .limit(booksPerPage)
    .forEach((book)=>books.push(book))
    .then(()=>{
        res.status(200).json(books)
    })
    .catch(()=>{
        res.status(500).json({error:'Could not fetch the books'})
    })
    // res.json({mssg:'Welcome to the API'})
})

app.get('/books/:id' , (req,res)=>{
    if(ObjectId.isValid(req.params.id)){
        
        db.collection('books')
        .findOne({_id:ObjectId(req.params.id)})
        .then((doc)=>{
            res.status(200).json(doc)
        })
        .catch((err)=>{
            res.status(500).json({error:'Could not fetch the documents'})
            // console.log();
        })

    }
    else{
        res.status(500).json({error:'Not Valid Id'})
    }
})

app.post('/books',(req,res)=>{
    book=req.body

    db.collection('books')
    .insertOne(book)
    .then((result)=>{
        res.status(201).json(result)
    })
    .catch((err)=>{
        res.status(500).json({error:'Could not post the book.'})
    })

})


app.delete('/books/:id', (req,res)=>{
    console.log('delete request');
    if(ObjectId.isValid(req.params.id)){
        
        db.collection('books')
        .deleteOne({_id:ObjectId(req.params.id)})
        .then((result)=>{
            res.status(200).json(result)
        })
        .catch((err)=>{
            res.status(500).json({error:'Could not delete the documents'})
            // console.log();
        })

    }
    else{
        res.status(500).json({error:'Not Valid Id'})
    }

})

app.patch('/books/:id', (req,res)=>{
    const updates=req.body
    if(ObjectId.isValid(req.params.id)){
        
        db.collection('books')
        .updateOne({_id:ObjectId(req.params.id)},{$set:updates})
        .then((result)=>{
            res.status(200).json(result)
        })
        .catch((err)=>{
            res.status(500).json({error:'Could not update the document'})
            // console.log();
        })

    }
    else{
        res.status(500).json({error:'Not Valid Id'})
    }

})