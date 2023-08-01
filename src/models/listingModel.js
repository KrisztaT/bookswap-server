const mongoose = require('mongoose');

// Schema for the "listing" collection, all fields are required
// ids are referenced to book and user model
const listingSchema = new mongoose.Schema({
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true,
  },
  lenderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  availability: {
    type: String,
    enum: ['available', 'borrowed'],
    required: true,
    default: 'available',
  },
  condition: {
    type: String,
    enum: ['new', 'good', 'acceptable', 'used'],
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
   /* These are part of the advanced scope 
  borrower_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  borrow_date: {
    type: Date,
    default: null,
  },
  due_date: {
    type: Date,
    default: null,
  }, */
});

const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;

