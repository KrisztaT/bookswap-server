const express = require('express')

// controller functions
const { getBook, addBook, updateBook, checkBookExists } = require('../controllers/bookController');

const router = express.Router()

// get book details
router.get('/book/:bookId', getBook )

// check if book exists in the database
router.get('/book/exists', checkBookExists )

// add book to database
router.post('/book', addBook )

// update book details
router.post('/book', updateBook )

module.exports = router