const request = require("supertest");

const { app } = require("../src/app");

const mongoose = require("mongoose");

const checkAuth = require("../src/middlewares/checkAuth");

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

// login data used for the test
const loginUserData = {
  username: "kriszta",
  password: "123456",
};

// 1. step: user needs to log in and receive a token to use the app
describe("Login - get lender listings workflow test", () => {
  let authToken;

  test("Successful login returns an auth token", async () => {
    const res = await request(app)
      .post("/api/user/login")
      .send(loginUserData);
    
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    // received token
    authToken = res.body.token;
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

  // 3.step: call listing endpoint to list all books of a lender
  test("Listing is allowed following authCheck", async () => {
    const res = await request(app)
      .get("/api/listing")
      .set("Authorization", `Bearer ${authToken}`);

    // if the request is successful status code 200 and a list of books is returned
    expect(res.status).toBe(200);
    expect(res.body).toEqual(expect.any(Array));
  });
});
