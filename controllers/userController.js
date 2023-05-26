const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const authMiddleware = require("../Middleware/authMiddleware");


//Register a new user
router.post("/register", async (req, res) => {
    try {
      const { username, email, password } = req.body;
  
      // Check if the email is already registered
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ 
          success: false,
          error: "Email is already registered" 
        });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new user
      const user = new User({
        username,
        email,
        password: hashedPassword,
      });
  
      // Save the user to the database
      await user.save();
  
      res.status(201).json({ 
        success: true,
        message: "User registered successfully",
        data: user
      });
    } catch (error) {
      res.status(500).json({ error: "Something went wrong" });
    }
  });
  
  router.post("/login", async (req, res) => {
      try {
        const { email, password } = req.body;
    
        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
          return res.status(401).json({ error: "Invalid email or password" });
        }
    
        // Compare the provided password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          return res.status(401).json({ error: "Invalid email or password" });
        }
    
        // Generate a JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
          expiresIn: "1d",
        });
    
        res.status(200).json({ 
          success:true,
          message:"Logged in successfully",
          token
       });
      } catch (error) {
        res.status(500).json({ error: "Something went wrong" });
      }
    });
  

    //get user details by id

    router.get('/getCurrentUser',authMiddleware, async (req, res) => {
        try {
          // Access the userId from the authenticated request
          const userId = req.userId;
      
          // Fetch the user data based on the userId
          const user = await User.findById(userId).select('-password');
      
          if (!user) {
            // If the user doesn't exist, return an error response
            return res.status(404).json({ success: false, message: 'User not found' });
          }
      
          // Return the user data
          res.status(200).json({ success: true, message: 'User details fetched successfully', user });
        } catch (error) {
          // Handle any other errors that occur
          res.status(500).json({ success: false, message: 'Server error' });
        }
      });
      
      
module.exports = router;
