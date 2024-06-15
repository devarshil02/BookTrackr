const { initializeAuth } = require("../src/middleware/auth.socket");
const { initializeChat } = require("../src/routes/chat/socket.index");

module.exports = {
  initializeSocket: function (io) {
    initializeAuth(io)
    initializeChat(io)
    io.on("connection", (socket) => {
      console.log("A user connected to the main namespace");

      socket.on("disconnect", () => {
        console.log("User disconnected from the main namespace");
      });
    });
    
  }
};
