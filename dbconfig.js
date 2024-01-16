const mongoose = require("mongoose");


const connection = async()=>{
  await mongoose
  .connect("mongodb+srv://hariiprasathh:hariprasath@cluster0.j9p9nei.mongodb.net/BigMovies?retryWrites=true&w=majority")
  .then(() => {
    console.log("Connected to MongoDB Atlas");
  })
  .catch((err) => {
    console.log("Connection Error: ", err);
  });
}

module.exports =connection;
