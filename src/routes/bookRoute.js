const express = require('express')

// controller functions
const { getBook, /* addBook, updateBook, checkBookExists */ } = require('../controllers/bookController');

const router = express.Router()

// get book details
router.get('/:bookId', getBook )

// check if book exists in the database
/* router.get('/exists', checkBookExists ) */

// add book to database
/* router.post('/', addBook ) */

// update book details
/* router.patch('/', updateBook ) */

module.exports = router