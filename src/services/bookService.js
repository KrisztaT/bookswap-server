// import Book model
const Book = require("../models/bookModel");
const mongoose = require("mongoose");

// update book details, only creator is authorised to do that
const updateBook = async (bookId, userId, newData) => {
  
    // update book details in the database and pass back the new book details
    const book = await Book.findOneAndUpdate(
      { _id: bookId, creatorId: userId},
      {
        ...newData,
      },
      { new: true }
    );
  
    // if book was not found with bookId or created by user with userId, error is sent.
    if (!book) {
        throw new Error("Request is not authorized or Book can not be found in the database.");
    } 
    return book;
  };

 
  // create book
  const createBook = async ({ imgUrl, title, author, page, releaseYear, creatorId }) => {
    try {
      return await Book.create({
        imgUrl,
        title,
        author,
        page,
        releaseYear,
        creatorId,
      });
    } catch (error) {
      // handle the error, log it, or rethrow it with more context
      throw new Error(`Error creating book: ${error.message}`);
    }
  };
  
module.exports = {
  updateBook,
  createBook
};