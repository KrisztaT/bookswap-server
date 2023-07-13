// import user model
const User = require("../models/userModel");
// import jwtwebtoken
const jwt = require('jsonwebtoken')

//create token function is used at both login and join
const createToken = (_id) => {
  return jwt.sign({_id},process.env.JWT_SECRET, {expiresIn: '8h'} )
}

// login user
const loginUser = async (request, response) => {
    const {username, password} = request.body;

    try {
        // invoke login static method from user model to give back user
        const user = await User.login(username, password);
    
        //create token
        const token = createToken(user._id)
    
        // if there is no error status will be 200 and add back json object with token
        response.status(200).json({ username, token });
      } catch (error) {
        // if error happened status will be 400 and give back the error message
        response.status(400).json({ error: error.message });
      }
};

// join user controller
const joinUser = async (request, response) => {
  /* Using object destructuring to extract the values of the properties `username`, `first_name`, `email`, and `password` from the
    `request.body` object. */
  const { username, first_name, email, password } = request.body;

  try {
    // invoke join static method from user model to give back user
    const user = await User.join(username, first_name, email, password);

    //create token
    const token = createToken(user._id)

    // if there is no error status will be 200 and add back json object with token
    response.status(200).json({ username, token });
  } catch (error) {
    // if error happened status will be 400 and give back the error message
    response.status(400).json({ error: error.message });
  }
};

module.exports = { loginUser, joinUser };
