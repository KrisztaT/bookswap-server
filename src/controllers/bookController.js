// import Book model
const Book = require("../models/bookModel");

const mongoose = require("mongoose");

// get a book
const getBook = async (req, res) => {
  // extract the id property from the params object of the req (request) object.
  const { bookId } = req.params;

  // check if the provided id is a valid MongoDB ObjectId.
  if (!mongoose.Types.ObjectId.isValid(bookId)) {
    return res.status(404).json({ error: "No such id." });
  }

  // query the database to find a book with the specified id.
  const book = await Book.findById(bookId);

  // book is not found
  if (!book) {
    return res.status(404).json({ error: "No such book" });
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

module.exports = {
  getBook,
  search
};
