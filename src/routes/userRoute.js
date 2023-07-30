const express = require('express')

// controller functions
const {loginUser, joinUser} = require('../controllers/userController');

//validate middleware import
const { validateLoginData, validateJoinData } = require('../middlewares/validate')

const router = express.Router()

// login route
router.post('/login', validateLoginData, loginUser)

// join route
router.post('/join', validateJoinData, joinUser)

module.exports = router