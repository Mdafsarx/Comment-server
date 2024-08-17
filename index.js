const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const app = express();
const port = process.env.PORT || 2000;
const cors = require('cors');

// middleware
app.use(express.json());
app.use(cors())


// mongodb


var uri = `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PAS}$.-@ac-kkyhebr-shard-00-00.zgmhkd0.mongodb.net:27017,ac-kkyhebr-shard-00-01.zgmhkd0.mongodb.net:27017,ac-kkyhebr-shard-00-02.zgmhkd0.mongodb.net:27017/?ssl=true&replicaSet=atlas-esi3hx-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0`;

// var uri = `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PAS}@ac-kkyhebr-shard-00-00.zgmhkd0.mongodb.net:27017,ac-kkyhebr-shard-00-01.zgmhkd0.mongodb.net:27017,ac-kkyhebr-shard-00-02.zgmhkd0.mongodb.net:27017/?ssl=true&replicaSet=atlas-esi3hx-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0`;

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
        const database = client.db("Comments").collection('comment');

        //  post 
        app.post('/comments', async (req, res) => {
            const comment = req.body;
            const result = await database.insertOne(comment);
            res.send(result)
        })
        //  get
        app.get('/comments',async(req,res)=>{
            const cursor= database.find();
            const result=await cursor.toArray();
            res.send(result)
        })
        // delete
        app.delete('/comments/:id',async(req,res)=>{
            const id=req.params.id;
            const filter={_id:new ObjectId(id)};
            const result = await database.deleteOne(filter);
            res.send(result)
        })
        // for update
        app.put('/comments/:id',async(req,res)=>{
             const id=req.params.id;
             const updateComment=req.body
             const updateDoc = {
                $set: {
                  name:updateComment.name ,
                  text: updateComment.text
                },
              };
              const result = await database.updateOne({_id:new ObjectId(id)}, updateDoc);
              res.send(result)

        })











        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
    }
}
run().catch(console.dir);








app.get('/', (req, res) => {
    res.send('The Comment server is running properly')
})
app.listen(port, () => {
    console.log('the server is running')
})
