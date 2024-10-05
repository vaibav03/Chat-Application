const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken")


const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  // if any of name,email, password is undefined we throw an error

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please Enter all the Feilds");
  }

  // check if the user already exists 

  const userExists = await User.findOne({ email });

  // if user already exists, throw an error

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // or create a new user

  const user = await User.create({
    name,
    email,
    password,
    pic,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),  // when we create a new user, a jwt needs to be created 
                                       // and send it to user
                                       // check backend/config/generateToken.js
    });
  } else {
    res.status(400);
    throw new Error("Failed to create new user");
  }
});



const authUser = asyncHandler(async (req, res) => {

  const { email, password } = req.body;

  // check whether user exists in the DB
  const user = await User.findOne({ email }); 

  // if user exists and password matches the password in DB
  
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid Email or Password");
  }
});


// api/user?search=rohit

const allUsers = asyncHandler(async (req, res) => {

  // to take a query from an api

  const keyword = req.query.search
    ? {
      // $or - mongoDB operator, it has to fulfill at least one condition (like OR)
      // regex is also in mongoDB, provides regular expression capabilities for patter matching string in queries
      // options = "i" for case insensitivity

        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  // $ne because we need not get the user that is loggged in 

  // check authMiddleware for this autorization 
  
  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);

});

module.exports = { authUser, registerUser, allUsers }; // we export it in userRoutes.js
