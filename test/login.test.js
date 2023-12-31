const request = require("supertest");

const { app } = require("../src/app");

const mongoose = require("mongoose");

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

// login unit test
describe("Login", () => {
  const testUsername = "testUser";
  const testPassword = "123456";

  // successful login the username and password is matching
  test("Successful login", async () => {
    const res = await request(app).post("/api/user/login").send({
      username: testUsername,
      password: testPassword,
    });
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/json/i);
    expect(res.body).toBeDefined();
    expect(res.body.token).toBeDefined();
    expect(res.body.username).toBe(testUsername);
  });

  // unsuccessful login the password is not matching
  test("Login fail due to incorrect password", async () => {
    const res = await request(app).post("/api/user/login").send({
      username: testUsername,
      password: "dfghjy",
    });
    expect(res.status).toBe(400);
    expect(res.headers["content-type"]).toMatch(/json/i);
    expect(res.body).toBeDefined();
    expect(res.body.error).toBe("Incorrect password! ");
  });

  // unsuccessful login the username is not matching
  test("Login fail due to incorrect username", async () => {
    const res = await request(app).post("/api/user/login").send({
      username: "Someone",
      password: testPassword,
    });
    expect(res.status).toBe(400);
    expect(res.headers["content-type"]).toMatch(/json/i);
    expect(res.body).toBeDefined();
    expect(res.body.error).toBe("Incorrect username! ");
  });

  // unsuccessful login the username is missing
  test("Login fail due to missing username", async () => {
    const res = await request(app).post("/api/user/login").send({
      password: testPassword,
    });
    expect(res.status).toBe(422);
    expect(res.headers["content-type"]).toMatch(/json/i);
    expect(res.body).toBeDefined();
    expect(res.body.error).toEqual([" Username is required. "]);
  });

  // unsuccessful login the password is missing
  test("Login fail due to missing password", async () => {
    const res = await request(app).post("/api/user/login").send({
      username: testUsername,
    });
    expect(res.status).toBe(422);
    expect(res.headers["content-type"]).toMatch(/json/i);
    expect(res.body).toBeDefined();
    expect(res.body.error).toEqual([" Password is required. "]);
  });
});
