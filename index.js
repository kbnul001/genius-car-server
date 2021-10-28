const express = require('express');
const { MongoClient, ObjectID } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const port = process.env.PORT || 5001;

const app = express();
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.egzwo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('Genius_car_mechanics');
        const servicesCollection = database.collection('services');

        //GET API
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.json(services);
        })
        //GET API Single
        app.get('/services/:id', async (req, res) => {
            const searchID = req.params.id;
            const query = { _id: ObjectID(searchID) };
            const service = await servicesCollection.findOne(query);
            res.json(service);
        })

        //POST API
        app.post('/services', async (req, res) => {
            const service = req.body;
            const result = await servicesCollection.insertOne(service);
            res.json(result);
        })

        //Delete API
        app.delete('/services/:id', async (req, res) => {
            const deleteId = req.params.id;
            const result = await servicesCollection.deleteOne({ _id: ObjectID(deleteId) });
            res.json(result);
        })
    }
    finally {

    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send("Genius Car Mechanics");
})

app.listen(port, () => {
    console.log("Listening to port ", port);
})