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

// test connection and rout handler
describe("Route handler tests", () => {
    
    test("GET / should return 'Hello world!'", async () => {
      const response = await request(app).get("/");
      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Hello world!");
    });
  
    test("GET any unmatched route should return a 404 with the attempted path", async () => {
      const response = await request(app).get("/nonexistent");
      expect(response.status).toBe(404);
      expect(response.body.message).toBe("No route with that path found!");
      expect(response.body.attemptedPath).toBe("/nonexistent");
    });
  });