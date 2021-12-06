import express from 'express';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import { ObjectID } from 'bson';

// https://hackaton2-node.herokuapp.com/  api url

dotenv.config(); //all keys it will put in process.env

const app=express();

const PORT=process.env.PORT;

app.use(express.json()) //inbuild middleware every request in app body is parse as json

// const MONGO_URL='mongodb://localhost'; old url before having mongo online in atlas
const MONGO_URL= process.env.MONGO_URL; // hidded 

async function createConnection() {
    const client =new MongoClient(MONGO_URL);
    await client.connect();
    console.log("Mongodb Connected");
    return client;
}

const client= await createConnection();

app.get("/",(request,response)=>{
    response.send("hello😊😊!!!");
})

app.post("/theaters",async(request,response)=>{
    const data=request.body

    const result=await client.db("b28wd").collection("theaters").insertMany(data);
    response.send(result);
})

app.get("/theaters",async(request,response)=>{
    const filter=request.query
    const result= await client.db("b28wd").collection("theaters").find(filter).toArray();
    response.send(result);
})

app.get("/theater/:name",async(request,response)=>{
    const{name}=request.params
    const result= await client.db("b28wd").collection("theaters").findOne({name:name});

    result?response.send(result):response.status(404).send({message:"no theather of this name"})
})

app.put("/theater/:name",async(request,response)=>{
    const{name}=request.params;
    const data=request.body;
    const result= await client.db("b28wd").collection("theaters").updateOne({name:name},{$set:data});
    response.send(result);
})

app.post("/Add-theater",async(request,response)=>{
    const data=request.body

    const result=await client.db("b28wd").collection("theaters").insertOne(data);
    response.send(result);
})

app.delete("/delete-theater/:id",async(request,response)=>{
    const{id}=request.params;
sa
    const result=await client.db("b28wd").collection("theaters").deleteOne({_id:ObjectID(id)});
    response.send(result);
})

app.listen(PORT,()=>{console.log("App started in PORT:",PORT)});