import bcrypt from "bcryptjs";
import User from "../models/usermodels.js";
import validator from "validator";
import jwt from "jsonwebtoken";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// user login controller
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate user input
    if (!email || !password) {
      return res.json({ success: false, message: "Email and password are required" });
    }
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    // Check if password matches
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.json({ success: false, message: "Invalid password" });
    }
    const token = createToken(user._id);
    console.log("Generated JWT Token:", token);
    res.json({ success: true, token });
  } catch (error) {
    console.error("Error during user login:", error);
    res.json({ success: false, message: "Server error" });
  }
};

// user registration controller
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // Validate user input
    if (!name || !email || !password) {
      return res.json({ message: "Name, email, and password are required" });
    }
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ message: "User already exists" });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.json({ message: "Invalid email format" });
    }

    if (password.length < 6) {
      return res.json({
        message: "Password must be at least 6 characters long",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10); // optional: you can adjust the salt rounds
    const hashedPassword = await bcrypt.hash(password, salt);
    // Create new user
    const newUser = new User({
      name: name,
      email: email,
      password: hashedPassword,
    });
    const user = await newUser.save();
    const token = createToken(user._id);
    console.log("Generated JWT Token:", token);
    res.json({ success: true, token });
  } catch (error) {
    console.error("Error during user registration:", error);
    res.json({ success: false, message: "Server error" });
  }
};

// admin login

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Validate admin input
    if (!email || !password) {
      return res.json({ success: false, message: "Email and password are required" });
    }
    // Check admin credentials from environment
    if (email !== process.env.ADMIN_EMAIL) {
      return res.json({ success: false, message: "Admin not found" });
    }
    // Check if password matches (plain compare against env)
    const isPasswordValid = password === process.env.ADMIN_PASSWORD;
    if (!isPasswordValid) {
      return res.json({ success: false, message: "Invalid password" });
    }
    // Successful login - create a token that identifies this as an admin session
     const token=jwt.sign({
       type: 'admin',
       email: email,
       timestamp: Date.now()
     }, process.env.JWT_SECRET); // create token
     res.json({success:true,token});    
  } catch (error) {
    console.error("Error during admin login:", error);
    res.json({ success: false, message: "Server error" });
  }
};

