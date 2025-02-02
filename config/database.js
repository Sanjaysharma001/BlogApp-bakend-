const mongoose = require('mongoose');
require("dotenv").config();


const dbConnect = () =>{
    mongoose.connect(process.env.DATABASE_URL)
  
     .then(console.log("Db connected Successfully"))
     .catch((error) => {
        console.log("DB Connection Issue");
        console.log(error);
     })
};

module.exports = dbConnect;
