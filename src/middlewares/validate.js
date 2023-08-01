const mongoose = require("mongoose");
const { body, query, validationResult } = require("express-validator");


// validation rules for user join
const validateJoinData = [
  // username must be defined and not be empty, additional rules can be found in the user model
  body("username")
    .notEmpty()
    .trim()
    .escape()
    .isLength({ min: 5 })
    .withMessage(" Username must be at least 5 characters long. "),

  // first_name must be defined and not be empty
  body("first_name")
    .notEmpty()
    .trim()
    .escape()
    .isLength({ min: 3 })
    .withMessage(" First name must be at least 3 characters long. "),

  // email must be defined and not be empty additional rules can be found in the user model
  body("email")
    .notEmpty()
    .isEmail()
    .normalizeEmail()
    .withMessage(" Invalid email address. "),

    // password must be defined and minimum 6 characters long
  body("password")
    .notEmpty()
    .trim()
    .escape()
    .isLength({ min: 6 })
    .withMessage(" Password must be at least 6 characters long. "),

  // process the validation results
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

// validation rules for login
const validateLoginData = [
  // both username and password is required
  body("username").notEmpty().withMessage(" Username is required. "),
  body("password").notEmpty().withMessage(" Password is required. "),

  // process the validation results
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

const validateIds = (req, res, next) => {
  const { bookId, listingId } = req.params;

  // check if listingId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(listingId)) {
    return res.status(400).json({ error: " Invalid listingId." });
  }

  // if bookId is defined, validate it as well
  if (bookId && !mongoose.Types.ObjectId.isValid(bookId)) {
    return res.status(400).json({ error: " Invalid bookId." });
  }

  next();
};

// capitalise takes a string as input and returns the same string with the first letter capitalised to store in the database
const capitalise = (value) => {
  // if the value is not a string, it simply returns the value without any modifications.
  if (typeof value !== "string") {
    return value;
  }
  // if the value string it returns the first letter capitalised string
  return value.charAt(0).toUpperCase() + value.slice(1);
};

// validating and sanitising book and listing data before data is stored in the database
const validateBookAndListingData = [
  // title must not be empty, trimmed by trailing whitespaces, escaping any potential dangerous chars, capitalised, in case it is empty message sent as error msg
  body("title")
    .notEmpty()
    .trim()
    .escape()
    .customSanitizer(capitalise)
    .withMessage(" Title is required! "),

  // author must not be empty, trimmed by trailing whitespaces, escaping any potential dangerous chars, capitalised, in case it is empty message sent as error msg
  body("author")
    .notEmpty()
    .trim()
    .escape()
    .customSanitizer(capitalise)
    .withMessage(" Author is required! "),

  // check if imgUrl is an url format, send msg if error occured (optional field)
  body("imgUrl")
    .optional({ checkFalsy: true })
    .isURL()
    .trim()
    .withMessage(" Not valid url format! "),

  // page has to be greater than 0 (optional field)
  body("page")
    .optional({ checkFalsy: true })
    .isInt({ gt: 0 })
    .withMessage(" Page number must be greater than 0! "),

  // check if releaseYear is a number between 1700 and 2023 (optional field)
  body("releaseYear")
    .optional({ checkFalsy: true })
    .isInt({ min: 1700, max: 2023 })
    .withMessage(" Release year has to be between 1700 and 2023! "),

  // check if condition is one of the allowed values
  body("condition")
    .isIn(["new", "good", "acceptable", "used"])
    .trim()
    .escape()
    .withMessage(" Condition is required and has to be chosen from the list! "),

  // check if location is not empty
  body("location")
    .notEmpty()
    .trim()
    .escape()
    .customSanitizer(capitalise)
    .withMessage(" Location is required! "),

  // process the validation and sanitisation results
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

// listing search validation and sanitisation rules
const validateSearchListingData = [
  // title is required and must not be empty, trimmed by trailing whitespaces, and escaped
  query('title')
    .notEmpty()
    .trim()
    .escape(),

  // author (optional) should be trimmed and escaped
  query('author').optional().trim().escape(),

  // location (optional) should be trimmed and escaped
  query('location').optional().trim().escape(),

  // condition (optional) should be trimmed and escaped
  query('condition').optional().trim().escape(),

  // process the validation results
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // error array is mapped and only the error messages are returned for meaningful error display on the frontend
      const errorMessages = errors.array().map((error) => error.msg);
      return res.status(422).json({ error: errorMessages });
    }
    // if validation is successful, continue to the searchListings middleware
    next();
  },
];


module.exports = {
  validateIds,
  validateBookAndListingData,
  validateLoginData,
  validateJoinData,
  validateSearchListingData,
};
