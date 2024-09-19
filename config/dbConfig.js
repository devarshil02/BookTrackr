const mongoose = require("mongoose");
require('dotenv').config(); 

module.exports = function () {
 
  mongoose.Promise = global.Promise;

  const DBURL = process.env.DATABASE_URL;
  const DBNAME = process.env.DATABASE_NAME;

  const URL = `${DBURL}/${DBNAME}?retryWrites=true&w=majority`;

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
