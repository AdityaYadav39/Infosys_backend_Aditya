
const mongoose = require("mongoose");

require("dotenv").config(); // with these sentense we can feed data to process from env *************** 

const dbconnect = () =>{
    mongoose.connect(process.env.DatabaseUrl)
    // understand how process.env works :

    .then(() => console.log("connect successfully"))
    .catch((error) => {
        console.error("connection error",error.message);
        //  what is process.exit
        process.exit(1);
    });
}

module.exports = dbconnect;