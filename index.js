const express = require('express');
const app = express();
const cors = require('cors');
const port = 5000;
require('dotenv').config();
const ObjectID = require('mongodb').ObjectID;

app.use(cors());
app.use(express.json());


console.log(process.env.DB_USER);
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vwmpo.mongodb.net/products?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db("e-grocery-db").collection("products");
  const ordersCollection = client.db("e-grocery-db").collection("orderData");
  
    app.get('/products',(req, res) => {
        productsCollection.find({})
        .toArray((err, documents) => {
            res.send(documents);
        })

    })

    app.get('/product/:id',(req, res) => {
        const id = req.params.id;
        productsCollection.find({_id: ObjectID(id)})
        .toArray((err, documents) => {
            res.send(documents[0]);
        })

    })

    app.post('/addOrders',(req, res) => {
        const orders = req.body;
       ordersCollection.insertOne(orders, (err, result)=>{
           console.log(err, result);
           res.send({count: result.insertedCount});
       }) 
    })

    app.get('/orders',(req, res) => {
        ordersCollection.find({})
        .toArray((err, documents) => {
            res.send(documents);
        })

    })

    app.get('/order/:email',(req, res) => {
        const email = req.params.customerEmail;        ;
        ordersCollection.find({email: email})
        .toArray((err, documents) => {
            res.send(documents);
        })

    })

    app.delete('/deleteOrder/:id', (req, res) => {
        const id = req.params.id;
        ordersCollection.deleteOne({_id: ObjectID(id)},(err, result) => {
            if (!err){
                res.send({count: 1});
            }
            // res.send({count: result.deletedCount});
        });
        
    })
    
    app.post('/addProduct/',(req, res) => {
        const product = req.body;
       productsCollection.insertOne(product, (err, result)=>{
           console.log(err, result);
           res.send({count: result.insertedCount });
       }) 
    })

  app.get('/', (req, res) => {
    res.send('Hello World!');
  })
});
 

app.listen(port);