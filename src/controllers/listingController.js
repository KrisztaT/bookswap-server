const mongoose = require("mongoose");
const Listing = require("../models/listingModel");
const Book = require("../models/bookModel");

// get listing details based on the lender id from the token
const getLenderListing = async (req, res) => {
  // user id coming from the jwt token
  const lenderId = req.user._id;

  // query the database to find th listing with the specified lender id and populate it with book details
  const lenderListings = await Listing.find({ lenderId }).populate('bookId')

  // listing details retrieved
  res.status(200).json(lenderListings);
};

// add book to the listing (if book does not exist add it to the database)
const addBookToListing = async (req, res) => {
  const { imgUrl, title, author, page, releaseYear } = req.body;

  // check if the book already exists in the "books" collection
  let book = await Book.findOne({ title, author });

  // if the book does not exist, add it to the "books" collection
  if (!book) {
    try {
      const userId = req.user._id;
      book = await Book.create({
        imgUrl,
        title,
        author,
        page,
        releaseYear,
        userId,
      });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  // add the listing details to the listings collection using the book id
  try {
    const lenderId = req.user._id;
    const bookId = book._id;
    const listing = await Listing.create({
      bookId,
      lenderId,
    });
    res.status(200).json(listing);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// update listing details, only lender is authorised to do that
// in MVP this is the availability status change
const updateListing = async (req, res) => {
 
};


const searchListings = async (req, res) => {


}
// delete listing
const deleteListing = async (req, res) => {
  
};


module.exports = {
    getLenderListing, 
    searchListings,
    addBookToListing, 
    updateListing, 
    deleteListing
};
