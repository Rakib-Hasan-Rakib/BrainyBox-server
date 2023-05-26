const express = require('express')
const cors = require('cors')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 4000


// middleware 
app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.BRAINY_BOX_USER}:${process.env.BRAINY_BOX_PASS}@cluster0.umvg5wn.mongodb.net/?retryWrites=true&w=majority`;

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
        // await client.connect();


        const toyCollection = client.db('toys').collection('addedToys')
        const tabToyCollection = client.db('toys').collection('tabToys')

        // index for search
        // const indexKeys = { toyName: 1 };
        // const indexOptions = { name: "toyName" };
        // const result = await toyCollection.createIndex(indexKeys, indexOptions);


        // get toys for tab
        app.get('/tabToys', async (req, res) => {
            const result = await tabToyCollection.find().toArray()
            res.send(result)
        })

        // get tab toys by id
        app.get('/tabToys/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await tabToyCollection.findOne(query)
            res.send(result)
        })


        // post toy details on database
        app.post('/addedToy', async (req, res) => {
            const addedToy = req.body
            const result = await toyCollection.insertOne(addedToy)
            res.send(result)
        })

        // find all toys from database
        app.get('/allToys', async (req, res) => {
            const result = await toyCollection.find().limit(20).toArray()
            res.send(result)
        })

        // find single toy by id from database
        app.get('/allToys/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await toyCollection.findOne(query)
            res.send(result)
        })

        // find my toys from database
        app.get('/myToys/:email', async (req, res) => {
            const serchedEmail = req.params.email
            const query = { email: serchedEmail }
            const cursor = toyCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })

        // get my toys by id
        app.get('/toys/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: new ObjectId(id) }
            const result = await toyCollection.findOne(query)
            res.send(result)
        })

        // update toys from my toys
        app.put('/myToys/:id', async (req, res) => {
            const id = req.params.id
            const updatedToy = req.body
            const query = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    ...updatedToy
                },
            };
            const result = await toyCollection.updateOne(query, updateDoc, options)
            res.send(result)
        })

        // delete toys from database
        app.delete('/myToys/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await toyCollection.deleteOne(query)
            res.send(result)
        })

        // get toy by search
        app.get('/searchedToy/:text', async (req, res) => {
            const text = req.params.text;
            const result = await toyCollection
                .find(
                    {
                        toyName: { $regex: text, $options: "i" },
                    })
                .toArray();
            res.send(result);
        })









        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);






app.get('/', (req, res) => {
    res.send('brainy box is running')
})

app.listen(port, () => {
    console.log(`brainy box is running on port: ${port}`);
})