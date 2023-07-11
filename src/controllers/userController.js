// import user model
const User = require('../models/userModel')

// login user
const loginUser = async (request, response) => {
    response.json({message: "Login successful"})
}

// join user
const joinUser = async (request, response) => {
    response.json({message: "Join successful"})
}

module.exports = {loginUser, joinUser}