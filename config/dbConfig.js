const mongoose = require("mongoose");
require('dotenv').config(); // Load environment variables from .env file

module.exports = function () {
  // Configuring the database
  mongoose.Promise = global.Promise;

  const DBURL = process.env.DATABASE_URL;
  const DBNAME = process.env.DATABASE_NAME;

  // Construct the connection URL
  const URL = `${DBURL}/${DBNAME}?retryWrites=true&w=majority`;

  // Connecting to the database
  mongoose
    .connect(URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("INFO: Successfully connected to the database");
    })
    .catch((err) => {
      console.log("INFO: Could not connect to the database.", err);
      process.exit();
    });
};
