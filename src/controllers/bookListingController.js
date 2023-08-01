const mongoose = require("mongoose");
const Listing = require("../models/listingModel");
const Book = require("../models/bookModel");
const { updateBook, createBook } = require("../services/bookService");
const { updateListing, createListing } = require("../services/listingService");
const { isEmptyData } = require("../services/isEmptyData");

// get listing details based on the lender id from the token
const getLenderListings = async (req, res) => {
  try {
    // user id coming from the jwt token
    const lenderId = req.user._id;

    // query the database to find the listings with the specified lender id and populate them with book details
    const lenderListings = await Listing.find({ lenderId }).populate("bookId");

    // map the listings to the response structure
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
        location: listing.location,
        condition: listing.condition,
      },
    }));

    // add status code and the response to the response object
    res.status(200).json(response);
  } catch (error) {
    //handle errors
    res.status(400).json({ error: error.message });
  }
};

// add book to the listing (if book does not exist add it to the database)
const addBookToListing = async (req, res) => {
  const { imgUrl, title, author, page, releaseYear, condition, location } =
    req.body;

  try {
    // check if the book already exists in the books collection
    let book = await Book.findOne({ title, author });

    // if the book does not exist, add it to the books collection
    if (!book) {
      const creatorId = req.user._id;
      book = await createBook({ imgUrl, title, author, page, releaseYear, creatorId });
    }

    // extract the lenderId from the request object. and bookId from the found book
    const lenderId = req.user._id;
    const bookId = book._id;

    // check if the listing already exists for this lender and book
    const listing = await Listing.findOne({ lenderId, bookId });

    if (!listing) {
      // add the listing details to the listings collection using the book id
      const newListing = await createListing(bookId, lenderId, condition, location);

      // create the response from the book and listing details
      const response = {
        book: {
          _id: book._id,
          imgUrl: book.imgUrl,
          title: book.title,
          author: book.author,
          page: book.page,
          releaseYear: book.releaseYear,
          creatorId: book.creatorId,
          isCreated: book.creatorId.toString() == lenderId.toString(),
        },
        listing: {
          _id: newListing._id,
          availability: newListing.availability,
          condition: newListing.condition,
          location: newListing.location,
        },
      };

       // add status code and the response to the response object
      res.status(200).json(response);
    } else {
      // listing already exists for this lender and book
      res.status(409).json({ error: "This book was already listed." });
    }
  } catch (error) {
    //handle errors
    res.status(400).json({ error: error.message });
  }
};

// search listing based on title
const searchListings = async (req, res) => {
  try {
    // deconstruct query string
    const { title, author, location, condition } = req.query;

    // create a base query object with the mandatory "title" field to be case insensitive for search
    const query = {title: { $regex: `^${title}`, $options: 'i' }};

    // add optional fields to the query if they are provided in the request and make it to be case insensitive for search
    if (author) query.author = { $regex: `^${author}`, $options: 'i' };

    // find the book based on the provided title
    const book = await Book.findOne(query);

    // if book is not found
    if (!book) {
      return res.status(404).json({ error: "Book can not be found!" });
    }

    // create an additional query object for listing search
    const listingQuery = { bookId: book._id };

    // add optional fields to the listing query if they are provided in the request and make it to be case insensitive for search
    if (location) listingQuery.location = { $regex: `^${location}`, $options: 'i' };
    // condition can be chosen from a list
    if (condition) listingQuery.condition = condition;

    // find the associated listings for the book
    // populate lender details
    const listings = await Listing.find(listingQuery).populate("lenderId");

    // check if listings array is empty return error
    if (!listings || listings.length === 0) {
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
        location: listing.location,
        condition: listing.condition,
        lender: {
          first_name: listing.lenderId.first_name,
          email: listing.lenderId.email,
        },
      })),
    };

    // add status code and the response to the response object
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

  try {
    // find the listing to be deleted based on listingId and lenderId
    const listing = await Listing.findOneAndDelete({
      _id: listingId,
      lenderId,
    });

    // add status code and the message to the response object
    res.status(200).json({ message: "Listing successfully deleted!" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// update book and listings function is calling two services
const updateBookAndListing = async (req, res) => {
  try {
    // bookId and listingId are coming from the parameters
    const { bookId, listingId } = req.params;
    // user id coming from the jwt token
    const userId = req.user._id;

    // find the book to have book information even if the creator is not the same as the user
    let book = await Book.findById(bookId);

    // check if the request body contains empty values
    isEmptyData(req.body);

    // if the creator is the same as the user, then update the book details and give back the new book information
    if (book.creatorId.toString() === userId.toString()) {
      book = await updateBook(bookId, userId, req.body);
    }

    // modify the listing information of the book
    const listing = await updateListing(listingId, userId, req.body);

    // response is created for listing book details.
    const response = {
      book: {
        _id: book._id,
        imgUrl: book.imgUrl,
        title: book.title,
        author: book.author,
        page: book.page,
        releaseYear: book.releaseYear,
        creatorId: book.creatorId,
        isCreated: book.creatorId.toString() === userId.toString(),
      },
      listing: {
        _id: listing._id,
        availability: listing.availability,
        location: listing.location,
        condition: listing.condition
      },
    };

    // give back response
    res.status(200).json(response);
  } catch (error) {
    // handle error
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getLenderListings,
  searchListings,
  addBookToListing,
  deleteListing,
  updateBookAndListing,
};
