const request = require("supertest");

const { app } = require("../src/app");

const mongoose = require("mongoose");

const User = require("../src/models/userModel")

beforeAll(async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL_TEST);
    console.log("Database connected successfully!");
  } catch (error) {
    console.error(error);
  }
});

afterAll(async () => {
  try {
    await mongoose.connection.close();
    console.log("Database connection closed.");
  } catch (error) {
    console.error(error);
  }
});

// join unit test
describe("Join", () => {
    // sucessful join test will succeed only once or following the deletion of the gabriella user from the database
  test("Successful join.", async () => {
    const testUserData = {
      username: "gabriella",
      first_name: "Gabriella",
      email: "gabriella@gmail.com",
      password: "gabi123456",
    };

    // make a POST request to the join endpoint with testUserData
    const res = await request(app)
      .post("/api/user/join")
      .send(testUserData);

    // check the response
    expect(res.status).toBe(200);
    expect(res.body.username).toBe(testUserData.username);
    expect(res.body.token).toBeDefined();

    // check the user is saved in the database
    const savedUser = await User.findOne({ username: testUserData.username });
    expect(savedUser).toBeDefined();
    expect(savedUser.email).toBe(testUserData.email);
  });

  test("Join fail due to missing required fields", async () => {
    const testUserData = {
      username: "gabriella",
      first_name: "Gabriella",
    };

    // make a POST request to the join endpoint with the partial data
    const res = await request(app)
      .post("/api/user/join")
      .send(testUserData);

    // check the response
    expect(res.status).toBe(422);
    expect(res.body.error).toEqual(["Invalid value", " Invalid email address. ", "Invalid value", " Password must be at least 6 characters long. "]);
  });

  test("Join fail due to username existing", async () => {
    const testUserData = {
        username: "gabriella",
        first_name: "Gabriella",
        email: "gabi@gmail.com",
        password: "gabi123456",
      };
    // post the username using gabriella again
    const res = await request(app)
      .post("/api/user/join")
      .send(testUserData);

    // check reponse
    expect(res.status).toBe(400);
    expect(res.body.error).toContain("Username is already in use! ");
  });

   test("Join fail due to invalid password length", async () => {
    const testUserData = {
      username: "noella",
      first_name: "Noella",
      email: "noella@yahoo.com",
      password: "short",
    };

    // post a short password
    const res = await request(app)
      .post("/api/user/join")
      .send(testUserData);

      // check response
    expect(res.status).toBe(422);
    expect(res.body.error).toContain(" Password must be at least 6 characters long. ");
  });

});
