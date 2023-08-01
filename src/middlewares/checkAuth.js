const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const checkAuth = async (req, res, next) => {
  // verify user is authenticated
  const { authorization } = req.headers

  /* if the authorization header is not present in the request header, 
  it means that the user is not authenticated and a response with a status code of 401
  (Unauthorized) and an error message of "Token required." is sent back to the client. */
  if (!authorization) {
    return res.status(401).json({error: 'Token required.'})
  }

  // if authorization header contains token it is acquired by splitting
  // it looks like 'Bearer token', so the token is kept from that
  const token = authorization.split(' ')[1]

  try {
    //  verify the authenticity of the token, deconstruct the _id
    const { _id } = jwt.verify(token, process.env.JWT_SECRET)

   // query the database to find a user with the specified _id 
   // and select only the _id field from the user document.
    req.user = await User.findOne({ _id }).select('_id')
    
   // pass control to the next (middleware) function 
    next()

    // error handling
  } catch (error) {
    res.status(401).json({error: 'Unauthorized due to lack of permission or an expired token.'})
  }
}

module.exports = checkAuth