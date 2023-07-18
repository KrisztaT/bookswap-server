const mongoose = require('mongoose');

// Schema for the "books" collection
const bookSchema = new mongoose.Schema({
  imgUrl: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  page: {
    type: String,
    required: true
  },
  releaseYear:{
    type: String,
    required: true
  },
  listingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing',
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('Book', bookSchema);
