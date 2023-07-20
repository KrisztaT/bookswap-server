const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  book_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true,
  },
  lender_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  availability: {
    type: String,
    enum: ['available', 'borrowed'],
    required: true,
  },
 /* These are part of the advanced scope 
  condition: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
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

