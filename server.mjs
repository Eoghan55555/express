import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { MongoClient } from 'mongodb'

dotenv.config()
const port = 5050
const mongoUrl = process.env.MONGO_URL || "";


const client = new MongoClient(mongoUrl);

const conn = await client.connect();
const db = conn.db("GameGallery");
console.log("connect to mongo");

const app = express()

app.use(express.json())
app.use(cors())
app.use((req,res,next) =>
{
    console.log(req.path, req.method)
    next()
})

//router /patrons/ console log all patrons from the db
app.get('/patrons/', getAllPatrons)

async function getAllPatrons(req, res) {
    try {
        const patronsCollection = db.collection("Patrons");
        const patrons = await patronsCollection.find({}).toArray();
        console.log("All patrons:", patrons);
        res.json(patrons).status(200)
    } catch (error) {
        console.error("Error fetching patrons:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})

app.post('/patrons/', addPatron) 
async function addPatron(req, res) {
    try {
        console.log('req body', req.body)
        const { name } = req.body;
        const patronsCollection = db.collection("Patrons");
        const result = await patronsCollection.insertOne({ name });
        console.log("New patron added:", result);
        res.status(201).json(result);
    } catch (error) {
        console.error("Error adding patron:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}