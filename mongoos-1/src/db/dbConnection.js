const mongoose=require('mongoose')
mongoose
  .connect("mongodb://localhost:27017/movieapi")
  .then(() => {
    console.log("Connected to database1");
  })
  .catch((err) => {
    console.error("Error connecting to database:", err);
  });

  module.exports=mongoose