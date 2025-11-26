const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = function (req, res, next) {
  const token = req.header("Authorization");

  if (!token)
    return res.status(401).json({ message: "Access Denied. No token provided." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;   // store user info
    next();
  } catch (err) {
    return res.status(400).json({ message: "Invalid token" });
  }
};
