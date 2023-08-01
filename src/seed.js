const userModel = require("./models/userModel");
const listingModel = require("./models/listingModel");
const bookModel = require("./models/bookModel");
const { databaseConnector, databaseDisconnector } = require("./database");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();

// seed database with data
const seedData = async () => {

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

  databaseConnector(databaseURL);

  // delete all documents
  await userModel.deleteMany();
  console.log("Deleted all users.");

  await listingModel.deleteMany();
  console.log("Deleted all listings.");

  await bookModel.deleteMany();
  console.log("Deleted all books.");

  const users = [
    {
      username: "testUser",
      first_name: "user",
      email: "user@gmail.com",
      password: "123456",
    },
    {
      username: "kriszta",
      first_name: "Kriszta",
      email: "kriszta@gmail.com",
      password: "123456",
    },
    {
      username: "jozsef",
      first_name: "Jozsef",
      email: "jozsef@gmail.com.com",
      password: "123456",
    },
    {
      username: "jennifer",
      first_name: "Jennifer",
      email: "jennifer@gmail.com.com",
      password: "123456",
    },
  ];

  const seedUsers = await userModel.create(
    await Promise.all(
      // salt and hash password to store in the database
      users.map(async (user) => {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(user.password, salt);
        return {
          ...user,
          password: hash,
        };
      })
    )
  );
  console.log("Users inserted to database.");

  books = [
    {
      imgUrl: "https://covers.openlibrary.org/b/id/11291394-L.jpg",
      title: "A game of thrones",
      author: "George R. R. Martin",
      page: "704",
      releaseYear: "2001",
      creatorId: seedUsers[0]._id,
    },
    {
      imgUrl: "https://covers.openlibrary.org/b/id/11943330-L.jpg",
      title: "It",
      author: "Stephen King",
      page: "1168",
      releaseYear: "1986",
      creatorId: seedUsers[1]._id,
    },
    {
      imgUrl: "https://covers.openlibrary.org/b/id/12324374-L.jpg",
      title: "A little life",
      author: "Hanya Yanagihara",
      page: "720",
      releaseYear: "2015",
      creatorId: seedUsers[2]._id,
    },
    {
      imgUrl: "https://covers.openlibrary.org/b/id/13198561-L.jpg",
      title: "Never Lie",
      author: "Freida McFadden",
      page: "268",
      releaseYear: "2022",
      creatorId: seedUsers[3]._id,
    },
  ];

  const seedBooks = await bookModel.insertMany(books);
  console.log("Books inserted to database.");

  const listings = [
    {
      bookId: seedBooks[0]._id,
      lenderId: seedUsers[0]._id,
      availability: "available",
      condition: "new",
      location: "Brisbane",
    },
    {
      bookId: seedBooks[1]._id,
      lenderId: seedUsers[1]._id,
      availability: "borrowed",
      condition: "good",
      location: "Melbourne",
    },
    {
      bookId: seedBooks[2]._id,
      lenderId: seedUsers[2]._id,
      availability: "available",
      condition: "acceptable",
      location: "Sydney",
    },
    {
      bookId: seedBooks[3]._id,
      lenderId: seedUsers[3]._id,
      availability: "available",
      condition: "used",
      location: "Sydney",
    },
    {
      bookId: seedBooks[3]._id,
      lenderId: seedUsers[0]._id,
      availability: "available",
      condition: "good",
      location: "Sydney",
    },
    {
      bookId: seedBooks[3]._id,
      lenderId: seedUsers[1]._id,
      availability: "available",
      condition: "good",
      location: "Sydney",
    },
    {
      bookId: seedBooks[2]._id,
      lenderId: seedUsers[0]._id,
      availability: "available",
      condition: "new",
      location: "Sydney",
    },
    {
      bookId: seedBooks[2]._id,
      lenderId: seedUsers[1]._id,
      availability: "available",
      condition: "new",
      location: "Brisbane",
    },
    {
      bookId: seedBooks[1]._id,
      lenderId: seedUsers[2]._id,
      availability: "available",
      condition: "good",
      location: "Perth",
    },
    {
      bookId: seedBooks[1]._id,
      lenderId: seedUsers[3]._id,
      availability: "available",
      condition: "used",
      location: "Cairns",
    },
    {
      bookId: seedBooks[0]._id,
      lenderId: seedUsers[1]._id,
      availability: "available",
      condition: "good",
      location: "Brisbane",
    },
    {
      bookId: seedBooks[0]._id,
      lenderId: seedUsers[2]._id,
      availability: "available",
      condition: "used",
      location: "Melbourne",
    },
  ];

  const seedListings = await listingModel.insertMany(listings);
  console.log("Listings inserted to database.");
};

seedData()
  .then(() => {
    console.log("Seeding completed successfully.");
    databaseDisconnector();
  })
  .catch((error) => {
    console.error("Seeding failed:", error);
    databaseDisconnector();
  });
