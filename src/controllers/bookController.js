// import Book model
const Book = require("../models/bookModel");

const mongoose = require("mongoose");

// get a book
const getBook = async (req, res) => {
  // extract the id property from the params object of the req (request) object.
  const { bookId } = req.params;

  // check if the provided id is a valid MongoDB ObjectId.
  if (!mongoose.Types.ObjectId.isValid(bookId)) {
    return res.status(404).json({ error: "Book can not be found with this id." });
  }

  // query the database to find a book with the specified id.
  const book = await Book.findById(bookId);

  // book is not found
  if (!book) {
    return res.status(404).json({ error: "Book can not be found in the database." });
  }

  // book retrieved
  res.status(200).json(book);
};

// search book to check if it exists in the database
const search = async (req, res) => {
  const { title, author } = req.query;

  // query the database for the book
  const book = await Book.findOne({ title, author });

  if (book) {
    // book exists in the database
    res.json({ exists: true });
  } else {
    // book does not exist in the database
    res.json({ exists: false });
  }
};

// add book to the database
const addBook = async (req, res) => {
  const { imgUrl, title, author, page, releaseYear } = req.body;
  
  // add book to the database
  try {
    // user id coming from the jwt token
    const userId = req.user._id; 
    const book = await Book.create({
      imgUrl,
      title,
      author,
      page,
      releaseYear,
      userId,
    });
    res.status(200).json(book);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// update book details, only creator is authorised to do that
const updateBook = async (req, res) => {
  // bookId is coming from the parameters
  const { bookId } = req.params;
  // user id coming from the jwt token
  const userId = req.user._id;

  // check if the provided id is a valid MongoDB ObjectId.
  if (!mongoose.Types.ObjectId.isValid(bookId)) {
    return res.status(400).json({ error: "Book can not be found with this id." });
  }

  // update book details in the database ans pass back the new book details
  const book = await Book.findOneAndUpdate(
    { _id: bookId, userId: userId},
    {
      ...req.body,
    },
    { new: true }
  );

  // if book was not found with bookId and created by user with userId, error is sent.
  if (!book) {
    return res.status(400).json({ error: "Request is not authorized or Book can not be found in the database." });
  }
  res.status(200).json(book);
};

module.exports = {
  getBook,
  search,
  addBook,
  updateBook
};
