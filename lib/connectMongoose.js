const mongoose = require("mongoose");
const i18n = require("i18n");

require("dotenv").config();

mongoose.connection.on("error", (err) => {
  console.log(i18n.__("Connection error"), err);
});

mongoose.connection.once("open", () => {
  console.log(i18n.__("Connected to MongoDB at"), mongoose.connection.name);
});

mongoose.connect(process.env.MONGODB_URL);

module.exports = mongoose.connection;
