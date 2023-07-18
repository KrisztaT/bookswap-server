const express = require('express')

// controller functions
const { getBook, addBook, updateBook, search } = require('../controllers/bookController');

const router = express.Router()

// search for book in the database
router.get('/search', search )

// get book details
router.get('/:bookId', getBook )

// add book to database
router.post('/', addBook )

// update book details
router.patch('/:bookId', updateBook )

module.exports = router