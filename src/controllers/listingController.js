const mongoose = require("mongoose");
const Listing = require("../models/listingModel");
const Book = require("../models/bookModel");

// get listing details based on the lender id from the token
const getLenderListing = async (req, res) => {
  try {
    // user id coming from the jwt token
    const lenderId = req.user._id;

    // query the database to find the listings with the specified lender id and populate them with book details
    const lenderListings = await Listing.find({ lenderId }).populate("bookId");

    // map the listings to the desired response structure
    const response = lenderListings.map((listing) => ({
      book: {
        _id: listing.bookId._id,
        imgUrl: listing.bookId.imgUrl,
        title: listing.bookId.title,
        author: listing.bookId.author,
        page: listing.bookId.page,
        releaseYear: listing.bookId.releaseYear,
        isCreated: listing.bookId.creatorId.toString() == lenderId.toString(),
      },
      listing: {
        _id: listing._id,
        availability: listing.availability,
      },
    }));

    // return the response with the mapped data
    res.status(200).json(response);
  } catch (error) {
    res.json({ error: error.message });
  }
};

// add book to the listing (if book does not exist add it to the database)
const addBookToListing = async (req, res) => {
  const { imgUrl, title, author, page, releaseYear } = req.body;

  try {
    // check if the book already exists in the "books" collection
    let book = await Book.findOne({ title, author });

    // if the book does not exist, add it to the "books" collection
    if (!book) {
      const creatorId = req.user._id;
      book = await Book.create({
        imgUrl,
        title,
        author,
        page,
        releaseYear,
        creatorId,
      });
    }

    const lenderId = req.user._id;
    const bookId = book._id;

    // check if the listing already exists for this lender and book
    const listing = await Listing.findOne({ lenderId, bookId });

    if (!listing) {
      // add the listing details to the listings collection using the book id
      const newListing = await Listing.create({
        bookId,
        lenderId,
      });

      const response = {
        book: {
          _id: book._id,
          imgUrl: book.imgUrl,
          title: book.title,
          author: book.author,
          page: book.page,
          releaseYear: book.releaseYear,
          creatorId: book.creatorId,
          isCreated: true,
        },
        listing: {
          _id: newListing._id,
          availability: newListing.availability,
        },
      };

      res.status(200).json(response);
    } else {
      // listing already exists for this lender and book
      res.status(409).json({ error: "This book was already listed." });
    }
  } catch (error) {
    res.json({ error: error.message });
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
      return res
        .status(404)
        .json({ error: "Listing can not be found for the book!" });
    }

    // combine book, listing, and lender details and send as the response
    const response = {
      book: {
        imgUrl: book.imgUrl,
        title: book.title,
        author: book.author,
        page: book.page,
        releaseYear: book.releaseYear,
        creatorId: book.creatorId,
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
    const listing = await Listing.findOneAndDelete({
      _id: listingId,
      lenderId,
    });

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
