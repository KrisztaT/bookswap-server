const request = require("supertest");

const { app } = require("../src/app");

const mongoose = require("mongoose");

const checkAuth = require("../src/middlewares/checkAuth");

const User = require("../src/models/userModel")

// connect to database before testing
beforeAll(async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL_TEST);
    console.log("Database connected successfully!");
  } catch (error) {
    console.error(error);
  }
});

// close database connection after testing
afterAll(async () => {
  try {
    await mongoose.connection.close();
    console.log("Database connection closed.");
  } catch (error) {
    console.error(error);
  }
});

// join data used for the test (test can be conducted once successfully or the user needs to be deleted from the database)
const joinUserData = 
    {
        "username": "sophie456",
        "first_name": "Sophie",
        "email": "sophie456@gmail.com",
        "password": "pass123"
      }
      
// 1. step: user needs to join and receive a token to use the app
describe("Join - search listings workflow test", () => {
  let authToken;

  test("Successful join.", async () => {
    
    // make a POST request to the join endpoint with testUserData
    const res = await request(app)
      .post("/api/user/join")
      .send(joinUserData);

    // check the response
    expect(res.status).toBe(200);
    expect(res.body.username).toBe(joinUserData.username);
    expect(res.body.token).toBeDefined();
    // received token
    authToken = res.body.token;

    // check the user is saved in the database
    const savedUser = await User.findOne({ username: joinUserData.username });
    expect(savedUser).toBeDefined();
    expect(savedUser.email).toBe(joinUserData.email);
  });

  // 2. step: received token is checked by the checkAuth middleware
  test("authCheck middleware checks the token from login valid", async () => {

    // mock request and response objects created
    const req = {
      headers: {
        authorization: `Bearer ${authToken}`,
      },
    };
    const res = {};

    // mock next function to check if it's called
    const next = jest.fn();

    // call the checkAuth middleware
    await checkAuth(req, res, next);

    // if the next function is called, the check is successful, otherwise error is thrown
    expect(next).toHaveBeenCalled();
  });

  // 3.step: call search listings endpoint to list all books that fit to the search criteria
  test("Listing is allowed following authCheck", async () => {
    const res = await request(app)
    .get("/api/listing/search?title=A game of thrones&condition=good")
    .set("Authorization", `Bearer ${authToken}`);
    
    // if the request is successful status code 200 and an object is received with books
    expect(res.status).toBe(200);
    expect(res.body).toEqual(expect.any(Object));
  });
});
