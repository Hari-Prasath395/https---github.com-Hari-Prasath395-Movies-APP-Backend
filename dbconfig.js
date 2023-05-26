const mongoose = require("mongoose");


const connection = async()=>{
  await mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Connection Error: ", err);
  });
}

module.exports =connection;
