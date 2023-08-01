const mongoose = require("mongoose");

// Schema for the "books" collection, title and author is required
//  creatorId is referenced to book and user model
const bookSchema = new mongoose.Schema({
  imgUrl: {
    type: String,
  },
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  page: {
    type: String,
  },
  releaseYear: {
    type: String,
  },
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model('Book', bookSchema);
