const mongoose = require("mongoose");
require("dotenv").config();

// connect to the database
mongoose.connect(process.env.mongoDbUrl);

// acquire the connection (to check if it is successful)
const db = mongoose.connection;

// error handling
db.on("error", console.error.bind(console, "connection error:"));

// open the connection
db.once("open", () => {
  console.log("Connected to the database!");
});
