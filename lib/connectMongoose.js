const mongoose = require("mongoose");

require("dotenv").config();

mongoose.connection.on("error", (err) => {
  console.log("Connection error", err);
});

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB at", mongoose.connection.name);
});

mongoose.connect(process.env.MONGODB_URL);

module.exports = mongoose.connection;
