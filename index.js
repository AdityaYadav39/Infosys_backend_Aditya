// write on your own ; 

const express = require("express");
const app = express();

//
require("dotenv").config();
const PORT = process.env.Port || 4000;

// middleware for parsing
app.use(express.json());

// import routes 
const Blogroutes = require("./Routes/User");
app.use("/api/v1",Blogroutes);

// database connection
const dbconnect = require("./Config/Database")
dbconnect();

// listen on port 
app.listen(PORT,()=>{
    console.log("connection running successfully on port");
})

// default 
app.get("/",(req,res)=>{
  res.send(`<h1> hi here is our blog program</h1>`);  
})