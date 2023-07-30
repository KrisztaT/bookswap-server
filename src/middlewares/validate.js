const mongoose = require("mongoose");

const validateIdsMiddleware = (req, res, next) => {
  const { bookId, listingId } = req.params;

  // check if listingId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(listingId)) {
    return res.status(400).json({ error: "Invalid listingId." });
  }

  // if bookId is defined, validate it as well
  if (bookId && !mongoose.Types.ObjectId.isValid(bookId)) {
    return res.status(400).json({ error: "Invalid bookId." });
  }

  next();
};

module.exports = { validateIdsMiddleware };
