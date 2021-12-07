import express, { request, response } from 'express';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import cors from 'cors';
import bcrypt from 'bcrypt';
import { ObjectId} from 'bson';

// https://hackaton2-node.herokuapp.com/  api url

dotenv.config(); //all keys it will put in process.env

const app=express();

const PORT=process.env.PORT;

app.use(cors());

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

app.get("/theater/:id",async(request,response)=>{
    const{id}=request.params
    const result= await client.db("b28wd").collection("theaters").findOne({_id:ObjectId(id)});

    result?response.send(result):response.status(404).send({message:"no theater of this name"})
})

app.put("/theater/:id",async(request,response)=>{
    const{id}=request.params;
    const data=request.body;
    const result= await client.db("b28wd").collection("theaters").updateOne({_id:ObjectId(id)},{$set:data});
    response.send(result);
})

app.put("/add-movies/:name",async(request,response)=>{
    const{name}=request.params;
    const data=request.body;

    const result= await client.db("b28wd").collection("theaters").updateOne({name:name},{$push:{movies:data}});
    console.log(result);
    response.send(result);
})

app.post("/Add-theater",async(request,response)=>{
    const data=request.body

    const result=await client.db("b28wd").collection("theaters").insertOne(data);
    response.send(result);
})

app.delete("/theater/:id",async(request,response)=>{
    const{id}=request.params;

    const result=await client.db("b28wd").collection("theaters").deleteOne({_id:ObjectId(id)});
    response.send(result);
})

app.post("/user/signup",async(request,response)=>{
    const {username,password}=request.body
    
    const userFound= await getUserById(username);//returns null if user is not present/found

    if(userFound){
        response.send({message:"user already exists"});
        return;
    }

    const hashedPassword=await genPassword(password);

    const result=await client.db("b28wd").collection("users").insertOne({username,password});
    response.send(result);

})

app.post("/user/login",async(request,response)=>{
    const{username,password}=request.body;

    const userFound=await getUserById(username);

    if(!userFound){
        response.send({message:"invalid user"});
        return
    }
    
    const storePassword=userFound.password;

    const ifPasswordMatch= await bcrypt.compare(password, storePassword) //compare stored password and entered pasword ,return ture if matches
     console.log(ifPasswordMatch,"stored:",storePassword,"entered:",password)
    // if(ifPasswordMatch){
    //     response.send({message:"Successful login"});
        //    return
    // }
    // else{
    //     response.send({message:"invalid password"});
    // }

    response.send(userFound);
})

async function getUserById(username){
    return await client.db("b28wd").collection("users").findOne({username:username})
}

async function genPassword(password){
    const No_of_Rounds=10;
    const salt=await bcrypt.genSalt(No_of_Rounds);
    const hashedPassword=await bcrypt.hash(password,salt);
    return hashedPassword;
}

app.listen(PORT,()=>{console.log("App started in PORT:",PORT)});