const express = require('express')

// controller functions import
const { getLenderListings, searchListings, addBookToListing,deleteListing, updateBookAndListing } = require('../controllers/bookListingController');

// check authentication middleware import
const checkAuth = require('../middlewares/checkAuth')

const router = express.Router()

// check auth for all book routes
router.use(checkAuth)

// get all listings of a lender
router.get('/', getLenderListings )

// Search listings based on book title
router.get("/search", searchListings)

// add listing to the database (if the book does not exist add that to the database first)
router.post('/', addBookToListing )

// update book and listing details
router.patch('/:bookId/:listingId', updateBookAndListing);

// delete listing
router.delete('/:listingId', deleteListing )

module.exports = router