const express = require('express')

// controller functions
const {loginUser, joinUser} = require('../controllers/userController');

const router = express.Router()

// login route
router.post('/login', loginUser)

// join route
router.post('/join', joinUser)

module.exports = router