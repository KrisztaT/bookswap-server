// import Book model
const Book = require("../models/bookModel");
const mongoose = require("mongoose");


// update book details, only creator is authorised to do that
const updateBook = async (bookId, userId, newData) => {
  
    // check if the provided id is a valid MongoDB ObjectId.
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
        throw new Error("Book can not be found with this id." );
    }
  
    // update book details in the database ans pass back the new book details
    const book = await Book.findOneAndUpdate(
      { _id: bookId, creatorId: userId},
      {
        ...newData,
      },
      { new: true }
    );
  
    // if book was not found with bookId and created by user with userId, error is sent.
    if (!book) {
        throw new Error("Request is not authorized or Book can not be found in the database.");
    }
    return book;
  };

  module.exports = {
    updateBook
  };