import express from 'express';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config(); //all keys it will put in process.env

const app=express();

const PORT=9000;

app.use(express.json()) //inbuild middleware every request in app body is parse as json

// const MONGO_URL='mongodb://localhost'; old url before having mongo online in atlas
const MONGO_URL= process.env.MONGO_URL; // hidded 

async function createConnection() {
    const client =new MongoClient(MONGO_URL);
    await client.connect();
    console.log("Mongodb Connected");
    return client;
}

const client=createConnection();

app.get("/",(request,response)=>{
    response.send("hello😊😊");
})

app.listen(PORT,()=>{console.log("App started in PORT:",PORT)});