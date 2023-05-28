const express = require('express')
const cors = require('cors');
const app = express();
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

// middleware
const corsOptions ={
  origin:'*', 
  credentials:true,    
  optionSuccessStatus:200,
}

app.use(cors(corsOptions))
app.use(express.json());

// Ab559txx

const uri =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.e60xkn0.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const toyCollection = client.db('toyDB').collection('toy')
    app.post('/addtoy', async(req, res) =>{
      const newToy = req.body;
      console.log(newToy)
      const result = await toyCollection.insertOne(newToy);
      res.send(result)
    })
    app.get('/addtoy', async(req, res)=>{
      const cursor = toyCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })

    app.get('/addtoy/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const user = await toyCollection.findOne(query);
      res.send(user)
  })
  app.get('/addtoy', async (req, res) => {
    const sort =req.query.sort;
    let query = {}
    if (req.query?.email) {
        query = { SellerEmail: req.query.email }
    }
    const options ={
        sort:{
            "price": sort ==='asc'? 1: -1
        }
    }
    const result = await toyCollection.find(query,options).toArray();
    res.send(result)
})

   
    app.delete('/addtoy/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await toyCollection.deleteOne(query);
      res.send(result)
  })


   
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) =>{
    res.send('toy store server in running')
})

app.listen(port, () =>{
    console.log(`toy store server in running on port: ${port}`)
})