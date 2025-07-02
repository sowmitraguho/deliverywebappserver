const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();
const PORT = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');

// Load env
dotenv.config();
// Middleware
app.use(cors());
app.use(express.json());

//MongoDB Connection


const uri = process.env.MONGODB_URI;

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

        //Database connection
        const productsInfoDB = client.db('DeliveryWebApp').collection("productsInfoDB");

        // post parcel data to mongodb
        app.post('/parcels', async (req, res) => {
            try {
                const data = req.body;
                const result = await productsInfoDB.insertOne(data);
                res.status(201).send(result);
            } catch (err) {
                console.error('Insert failed:', err);
                res.status(500).send({ message: 'Insert failed' });
            }
        });

        // get parcel data from mongodb
        app.get('/parcels', async (req, res) => {
            try {
                const allParcels = await productsInfoDB.find().toArray();
                res.send(allParcels);
            } catch (err) {
                console.error('Fetch failed:', err);
                res.status(500).send({ message: 'Fetch failed' });
            }
        });



        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        // console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);






// Root Route
app.get('/', (req, res) => {
    res.send('Delivery App API is running...');
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
