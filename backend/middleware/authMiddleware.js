// to authorise if the user is logged in or not

const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");
const asyncHandler = require("express-async-handler");

const protect = asyncHandler(async (req, res, next) => {
  
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
    // token looks like Bearer bsbbuebfbojs
  ) {
    try {
   
      // we remove the bearer and take the token  
      token = req.headers.authorization.split(" ")[1];

      //decodes token id
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // find the user in the DB and return it without the password
      
      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

module.exports = { protect };