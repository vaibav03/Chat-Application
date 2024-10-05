// install jwt - json web token
// jwt helps us to authorise user in backend
// user will send a jwt to the backend and backend will verify whether that user can access that data

const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  
 // sign a new token with that particular id 
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",       // 30 days
  });
};

module.exports = generateToken;