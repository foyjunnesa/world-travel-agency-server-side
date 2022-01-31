const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config()


const app = express();
const port = process.env.PORT || 5000;

// middleWare
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.m1j2v.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('worldTour');
        const servicesCollection = database.collection('services');

        // GET API:
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            console.log(cursor)
            const services = await cursor.toArray();
            res.send(services);
        });

        // GET SINGLE Service:
        app.get('/singleServices/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting single id')

            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.json(service);
        })

        // POST API:
        app.post('/addServices', async (req, res) => {
            const service = req.body;
            console.log('hit the post api', service);

            const result = await servicesCollection.insertOne(service);
            console.log(result)
            res.json(result)
        });
    }

    catch (error) {

    }
    finally {

    }

}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running Tourist Server');
});

app.listen(port, () => {
    console.log('Running Tourist Server on port', port);
})