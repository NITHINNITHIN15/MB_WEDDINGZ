// const express = require("express");
// const router = express.Router();
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const User = require("../models/User");

// // REGISTER
// router.post("/register", async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     if (!name || !email || !password)
//       return res.status(400).json({ message: "All fields are required" });

//     const existing = await User.findOne({ email });
//     if (existing)
//       return res.status(400).json({ message: "Email already exists" });

//     const user = await User.create({ name, email, password });

//     res.status(201).json({
//       message: "User created successfully",
//       user: { id: user._id, name: user.name, email: user.email }
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });


// // LOGIN
// router.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });
//     if (!user)
//       return res.status(400).json({ message: "Invalid email or password" });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch)
//       return res.status(400).json({ message: "Invalid email or password" });

//     const token = jwt.sign(
//   { id: user._id, email: user.email, role: user.role },
//   process.env.JWT_SECRET,
//   { expiresIn: "7d" }
// );

//     res.json({
//       message: "Login successful",
//       token,
//       user: { id: user._id, name: user.name, email: user.email, role: user.role }
//     });

//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });
// module.exports = router;



const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Hardcoded admin credentials
const ADMIN_EMAIL = "admin@example.com";
const ADMIN_PASSWORD = "admin123";

// REGISTER - Only for regular users
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Prevent registering with admin email
    if (email === ADMIN_EMAIL) {
      return res.status(400).json({ message: "This email is reserved" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const user = await User.create({ name, email, password, role: "user" });
    
    res.status(201).json({
      message: "User created successfully",
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// LOGIN - Combined for Admin & User
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log("🔍 Login attempt:", { email, password: "***" });

    // Check if admin login
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      console.log("✅ Admin credentials matched!");
      
      const token = jwt.sign(
        { email, role: "admin", isAdmin: true },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );
      
      console.log("🔑 Admin token generated");
      
      return res.json({
        message: "Admin login successful",
        token,
        user: {
          name: "Administrator",
          email,
          role: "admin",
        },
      });
    }

    console.log("👤 Checking user database...");

    // Check user login
    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ User not found");
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("❌ Password mismatch");
      return res.status(400).json({ message: "Invalid email or password" });
    }

    console.log("✅ User credentials matched!");

    const token = jwt.sign(
      { id: user._id, email: user.email, role: "user", isAdmin: false },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log("🔑 User token generated");

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: "user",
      },
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;