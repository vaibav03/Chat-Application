// has all routes related to the user

const express =require("express")
const { registerUser, authUser, allUsers } = require("../controllers/userControllers");
const { protect } = require("../middleware/authMiddleware");


const router = express.Router()   // we will use it to create different routes 

// This authuser and registterUser are there in usercontrollers

// It has to go through the protect middleware before going to allUsers
// protect middleware is in authMiddleware

router.route("/").post( registerUser).get(protect, allUsers); 

router.post("/login", authUser);

// both the above lines do the same thing, they are just a differnt way of writing it 



module.exports = router; 