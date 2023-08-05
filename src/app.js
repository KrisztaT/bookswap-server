/* import the dotenv package to load
environment variables from a .env file */
const dotenv = require("dotenv");
dotenv.config();

// import the Express.js module
const express = require("express");
const app = express();

// mongoose module import
const mongoose = require("mongoose");
// user routes import
const userRoute = require("./routes/userRoute");

// listing route import
const listingRoute = require("./routes/bookListingRoute");

/* assign the value of the environment variable HOST to the constant HOST. 
If the HOST environment variable is not defined, it will
default to `'localhost'`. Same with the PORT */
const HOST = process.env.HOST || "localhost";
const PORT = process.env.PORT || 3001;

// use helmet package to enhance the security of the application. 
const helmet = require("helmet");
app.use(helmet());
app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.referrerPolicy());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["self"],
    },
  })
);

/* use the cors package to enable Cross-Origin Resource Sharing (CORS) in the
application. CORS is a mechanism that allows resources (e.g., APIs) on a web page to be
requested from another domain outside the domain from which the resource originated. */
const cors = require("cors");
var corsOptions = {
  origin: ["http://localhost:3000", "https://bookswap-client.netlify.app"],
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// database URL switcher
var databaseURL = "";
switch (process.env.NODE_ENV.toLowerCase()) {
  case "test":
    databaseURL = process.env.DATABASE_URL_TEST;
    break;
  case "development":
    databaseURL = process.env.DATABASE_URL_DEV;
    break;
  case "production":
    databaseURL = process.env.DATABASE_URL;
    break;
  default:
    console.error(
      "Incorrect JS environment specified, database will not be connected."
    );
    break;
}

// import database connector from database.js
const { databaseConnector } = require("./database");

// connect to database
databaseConnector(databaseURL)
  .then(() => {
    console.log("Database connected successfully!");
  })
  .catch((error) => {
    console.log(`
    Some error occurred connecting to the database! It was: 
    ${error}
    `);
  });


/* parse incoming requests with JSON
payloads. It allows the application to access the request body as a JavaScript object. */
app.use(express.json());
// a middleware function that parses incoming requests with URL-encoded payloads.
app.use(express.urlencoded({ extended: true }));

// register user route
app.use("/api/user", userRoute);

//register listing route
app.use("/api/listing", listingRoute);

// route handler for the GET request to the root path ("/") 
app.get("/", (request, response) => {
  response.json({
    message: "Hello world!",
  });
});

/* define a route handler for any GET request that does not match any of the previously
defined routes in the application. */
app.get("*", (request, response) => {
  response.status(404).json({
    message: "No route with that path found!",
    attemptedPath: request.path,
  });
});

// error handling middleware function is defined to catch all errors and handle them
app.use((error, request, response, next) => {
  const statusCode = error.statusCode || 500;
  response.status(statusCode).json({
    error: error.message
  });
});

module.exports = {
  HOST,
  PORT,
  app,
};
