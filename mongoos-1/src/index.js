const express = require("express");
require('dotenv').config()
const bcrypt=require('bcrypt')
const app = express();
const PORT = process.env.PORT || 8080;
app.use(express.json());
const mongoose=require('mongoose');
console.log(process.env.PORT);
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.error("Error connecting to database:", err);
  });
  
//product Schema

const productSchema=new mongoose.Schema({
  name:{type:String,required:true},
  category:{type:String},
  description:{type:String},
  price:{type:Number}
})

//product model
const product = mongoose.model("product", productSchema);


//user schema

const userSchema=new mongoose.Schema({
  name:{type:String,required:true},
  email:{type:String,required:true,unique:true},
  password:{type:String,required:true}
})

//user model
const User=mongoose.model("User",userSchema);

app.get('/getUser',async(req,res)=>{
  res.status(201).send({message:"Everything is fine"})
})

//registration user
app.post('/register',async(req,res)=>{
  const data = req.body;
  try {
      const user = await User.findOne({ email: data.email });
      if (user) {
          res.status(400).json({ message: "Email already exists" });
      } else {
          // Hash the password
          
          const hashedPassword = await bcrypt.hash(data.password, 4);
          
          // Update the password in the data object with the hashed value
          data.password = hashedPassword;
          // Create the user
          await User.create(data);
          res.status(200).json({ message: "Successfully registered" });
      }
  } catch (error) {
      console.error("Error during registration:", error);
      res.status(500).json({ message: "Internal server error" });
  }
})

//login user

app.post('/login',async(req,res)=>{
  const data = req.body;
  try {
      const user = await User.findOne({ email: data.email });
      if (!user) {
          res.status(400).json({ message: "Email does not exist" });
      } else {
          // Check if the password is correct
          const isPasswordCorrect = await bcrypt.compare(
              data.password,
              user.password
          );
          if (!isPasswordCorrect) {
              res.status(400).json({ message: "Incorrect password" });
          } else {
            const jwt = require("jsonwebtoken");
            const payload = { foo: "bar" };
            const secretKey = data.email;
            const token = jwt.sign(payload, secretKey);
              res.status(200).json({ message: "Successfully logged in",token:token});
          }
      }
  } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ message: "Internal server error" });
  }
})




//add product

app.post('/addProduct',async(req,res)=>{
  const data =await req.body;
  try {
      const product1 = await product.findOne({ name: data.name });
      if (product1) {
          res.status(400).json({ message: "Product already exists" });
      } else {
        
          // Create the product
          await product.create(data);
          res.status(200).json({ message: "Successfully Added your product." });
      }
  } catch (error) {
      console.log('Error adding a new product');
       res.status(500).json({ message: "Internal server error" });
  }
});


//get all products

app.get('/getProducts',async(req,res)=>{
  try {
      const products = await product.find();
      res.status(200).json(products);
  } catch (error) {
      console.log('Error getting all products');
      res.status(500).json({ message: "Internal server error" });
  }
});


//update product

app.patch("/editProduct/:id", async (req, res) => {
    let id=req.params.id;
    let updateInfo = req.body;
  
    try{
        const updatedProd = await product.findByIdAndUpdate(id , updateInfo , {new : true})
        res.status(200).json(updatedProd);
    }catch(err){
        console.log("Error in updating Product");
        res.status(500).json({message:"Server Error!"});
    }
    
});


//delete product

app.delete("/deleteProduct/:id", async (req, res) => {
    let prodId = req.params.id;

    try{
        const deletedProd = await product.findByIdAndDelete(prodId);
        if(!deletedProd) return res.status(404).json({msg:"No product with this ID"});
        
        res.json({ msg : 'Product has been removed' })
    }catch(e){
        res.status(400).json({ msg : 'There was an error deleting the product.'})
    }
});
         



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`);
});

