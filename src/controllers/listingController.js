const mongoose = require("mongoose");
const Listing = require("../models/listingModel");
const Book = require("../models/bookModel");

// get listing details based on the lender id from the token
const getLenderListing = async (req, res) => {
  // user id coming from the jwt token
  const lenderId = req.user._id;

  // query the database to find th listing with the specified lender id and populate it with book details
  const lenderListings = await Listing.find({ lenderId }).populate("bookId");

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
  // listingId is coming from the parameters
  const { listingId } = req.params;
  // lender id coming from the jwt token
  const lenderId = req.user._id;

  // check if the provided id is a valid MongoDB ObjectId.
  if (!mongoose.Types.ObjectId.isValid(listingId)) {
    return res
      .status(400)
      .json({ error: "Listing can not be found with this id." });
  }

  // update listing details in the database and pass back the new listing details
  const listing = await Listing.findOneAndUpdate(
    { _id: listingId, lenderId: lenderId },
    {
      ...req.body,
    },
    { new: true }
  );

  // if listing was not found with listingId and created by user with lenderId, error is sent.
  if (!listing) {
    return res.status(400).json({
      error:
        "Request is not authorized or Listing can not be found in the database.",
    });
  }
  res.status(200).json(listing);
};

// search listing based on title
const searchListings = async (req, res) => {
  try {
    const { title } = req.query;

    // find the book based on the provided title
    const book = await Book.findOne({ title });

    // if book is not found
    if (!book) {
      return res.status(404).json({ error: "Book can not be found!" });
    }

    // find the associated listings for the book
    //populate lender details (only include first_name and email)
    const listings = await Listing.find({ bookId: book._id }).populate(
      "lenderId"
    );

    if (!listings) {
      return res.status(404).json({ error: "Listing can not be found for the book!" });
    }

    // combine book, listing, and lender details and send as the response
    const response = {
      book: {
        imgUrl: book.imgUrl,
        title: book.title,
        author: book.author,
        page: book.page,
        releaseYear: book.releaseYear,
      },
      listings: listings.map((listing) => ({
        availability: listing.availability,
        lender: {
          first_name: listing.lenderId.first_name,
          email: listing.lenderId.email,
        },
      })),
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// delete listing
const deleteListing = async (req, res) => {
  // listingId is coming from the parameters
  const { listingId } = req.params;
  // lender id coming from the jwt token
  const lenderId = req.user._id;

  // check if the provided id is a valid MongoDB ObjectId.
  if (!mongoose.Types.ObjectId.isValid(listingId)) {
    return res
      .status(400)
      .json({ error: "Listing can not be found with this id." });
  }

  try {
    // find the listing to be deleted based on listingId and lenderId
    const listing = await Listing.findOneAndDelete({ _id: listingId, lenderId });

    res.json({ message: "Listing successfully deleted!" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getLenderListing,
  searchListings,
  addBookToListing,
  updateListing,
  deleteListing,
};
