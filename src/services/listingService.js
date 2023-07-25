const Listing = require("../models/listingModel");
const mongoose = require("mongoose");

// update listing details, only lender is authorised to do that
// in MVP this is the availability status change
const updateListing = async (listingId, userId, newData) => {
     
    // check if the provided id is a valid MongoDB ObjectId.
    if (!mongoose.Types.ObjectId.isValid(listingId)) {
        throw new Error("Listing can not be found with this id.");
      }
  
    // update listing details in the database and pass back the new listing details
    const listing = await Listing.findOneAndUpdate(
      { _id: listingId, lenderId: userId },
      {
        ...newData,
      },
      { new: true }
    );
  
    // if listing was not found with listingId and created by user with lenderId, error is sent.
    if (!listing) {
        throw new Error("Request is not authorized or Listing can not be found in the database.");
      }
    return listing;
  };

  module.exports = {
    updateListing,
  };
  