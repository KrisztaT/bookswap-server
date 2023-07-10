/* The code `const dotenv = require('dotenv'); dotenv.config();` is using the `dotenv` package to load
environment variables from a `.env` file into the Node.js application. */
const dotenv = require('dotenv');
dotenv.config();


/* The code `const express = require('express');` is importing the Express.js module, which is a web
application framework for Node.js. */
const express = require('express');
const app = express();

/* The code `const HOST = process.env.HOST || 'localhost';` is assigning the value of the environment
variable `HOST` to the constant `HOST`. If the `HOST` environment variable is not defined, it will
default to `'localhost'`. */
const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 3000;


/* The code is using the `helmet` package to enhance the security of the Express.js application. */
const helmet = require('helmet');
app.use(helmet());
app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.referrerPolicy());
app.use(helmet.contentSecurityPolicy({
    directives:{
        defaultSrc:["'self'"]
    }
}));


/* The code is using the `cors` package to enable Cross-Origin Resource Sharing (CORS) in the
Express.js application. CORS is a mechanism that allows resources (e.g., APIs) on a web page to be
requested from another domain outside the domain from which the resource originated. */
const cors = require('cors');
var corsOptions = {
    origin: ["http://localhost:5000", ],
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions));


/* The code `app.use(express.json())` is a middleware function that parses incoming requests with JSON
payloads. It allows the application to access the request body as a JavaScript object. */
app.use(express.json());
/* The code `app.use(express.urlencoded({extended: true}));` is a middleware function that parses
incoming requests with URL-encoded payloads. It allows the application to access the request body as
a JavaScript object when the data is sent in the URL-encoded format. The `extended: true` option
allows for parsing of nested objects in the URL-encoded data. */
app.use(express.urlencoded({extended: true}));


/* The code is defining a route handler for the GET request to the root path ("/") of the Express.js
application. */
app.get('/', (request, response) => {
    response.json({
        message:"Hello world!"
    });
});


/* The code is defining a route handler for any GET request that does not match any of the previously
defined routes in the Express.js application. */
app.get('*', (request, response) => {
    response.status(404).json({
        message: "No route with that path found!",
        attemptedPath: request.path
    });
});

module.exports = {
    HOST,
    PORT,
    app
}