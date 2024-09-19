const express = require("express");
const app = express();
const morgan = require("morgan");
const dotenv = require("dotenv");
const config = require("./config/config");
const dbConfig = require("./config/dbConfig");
const routes = require("./src/routes");
const path = require("path");
dotenv.config();
const fs = require("fs");

const PORT = process.env.PORT || 8080;

app.use(
  morgan(
    ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] - :response-time ms'
  )
);

config(app);
dbConfig();
routes(app);

const staticPath = path.join(__dirname, "uploads");
app.use(express.static(staticPath));
app.use("/uploads", express.static(staticPath));

if (!fs.existsSync(staticPath)) {
  fs.mkdirSync(staticPath);
}

app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});