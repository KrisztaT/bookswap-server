const mongoose = require("mongoose");
const { body, validationResult } = require("express-validator");

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

// capitalise takes a string as input and returns the same string with the first letter capitalised to store in the database
const capitalise = (value) => {
  // if the value is not a string, it simply returns the value without any modifications.
  if (typeof value !== "string") {
    return value;
  }
  // if the value string it returns the first letter cpitalised string
  return value.charAt(0).toUpperCase() + value.slice(1);
};

// validating and sanitising book and listing data before data is stored in the database
const validateAndSanitiseAddBookAndListing = [
  // title must not be empty, trimmed by trailing whitespaces, escaping any potential dangerous chars, capitalised, in case it is empty message sent as error msg
  body("title")
    .notEmpty()
    .trim()
    .escape()
    .customSanitizer(capitalise)
    .withMessage("Title is required! "),

  // author must not be empty, trimmed by trailing whitespaces, escaping any potential dangerous chars, capitalised, in case it is empty message sent as error msg
  body("author")
    .notEmpty()
    .trim()
    .escape()
    .customSanitizer(capitalise)
    .withMessage("Author is required! "),

  // check if imgUrl is an url format, send msg if error occured (optional field)
  body("imgUrl")
    .optional({ checkFalsy: true })
    .isURL()
    .trim()
    .withMessage("Not valid url format! "),

  // page has to be greater than 0 (optional field)
  body("page")
    .optional({ checkFalsy: true })
    .isInt({ gt: 0 })
    .withMessage("Page number must be greater than 0! "),

  // check if releaseYear is a number between 1700 and 2023 (optional field)
  body("releaseYear")
    .optional({ checkFalsy: true })
    .isInt({ min: 1700, max: 2023 })
    .withMessage("Release year has to be between 1700 and 2023! "),

  // check if condition is one of the allowed values
  body("condition")
    .isIn(["new", "good", "acceptable", "used"])
    .trim()
    .escape()
    .withMessage("Condition is required and has to be chosen from the list! "),

  // check if location is not empty
  body("location")
    .notEmpty()
    .trim()
    .escape()
    .customSanitizer(capitalise)
    .withMessage("Location is required! "),

  // process the validation and sanitization results
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
     // error array is mapped and only the error messages are returned for meaningful error display on the frontend
      const errorMessages = errors.array().map((error) => error.msg);
      return res.status(422).json({ error: errorMessages });
    }
    // if validation is successful, continue to the next middleware/controller
    next();
  },
];

module.exports = {
  validateIdsMiddleware,
  validateAndSanitiseAddBookAndListing,
};
