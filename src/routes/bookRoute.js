const express = require('express')

// controller functions import
const { getBook, addBook, updateBook, search } = require('../controllers/bookController');

// check authentication middleware import
const checkAuth = require('../middlewares/checkAuth')

const router = express.Router()

// check auth for all book routes
router.use(checkAuth)

// search for book in the database
router.get('/search', search )

// get book details
router.get('/:bookId', getBook )

// add book to database
router.post('/', addBook )

// update book details
router.patch('/:bookId', updateBook )

module.exports = router