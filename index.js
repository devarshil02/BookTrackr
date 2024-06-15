const express = require("express");
const app = express();
const http = require("http").createServer(app); // Create HTTP server
const morgan = require("morgan");
const dotenv = require("dotenv");
const config = require("./config/config");
const dbConfig = require("./config/dbConfig");
const routes = require("./src/routes");
const socketIo = require('socket.io');
const path = require("path");
const { initializeSocket } = require("./config/socketConfig");
dotenv.config();
const fs = require("fs");

const PORT = process.env.PORT || 8080;
const io = socketIo(http,{
  cors: {
    origin: "*",
    methods: ["*"]
  }
});

// Set up middleware
app.use(
  morgan(
    ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] - :response-time ms'
  )
);

// Serve your routes
config(app);
dbConfig();
routes(app);
initializeSocket(io)
const staticPath = path.join(__dirname, "uploads");
app.use(express.static(staticPath));
app.use("/uploads", express.static(staticPath));

if (!fs.existsSync(staticPath)) {
  fs.mkdirSync(staticPath);
}

http.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});