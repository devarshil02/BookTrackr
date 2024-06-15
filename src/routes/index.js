const authRoutes = require("./auth/index.js");
const userRoutes = require("./user/index.js");
// const roomsRoutes = require("./rooms/socket.index.js");
const { upload } = require("../middleware/avatar.js");
const path = require("path");

module.exports = (app) => {
  app.get("/", (req, res) => {
    res.json({
      message: "These are dev-freelance APIs",
      api_health: "good",
      api_version: "V1.0.0",
    });
  });
  app.use("/v1/auth", authRoutes);
  app.use("/v1/users", userRoutes);
  app.use("/v1/upload", upload.single('image'), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const filePath = path.join('uploads', req.file.filename);
    const sanitizedFilePath = filePath.replace(path.sep, '/');

    res.status(200).json({ message: 'File uploaded successfully', filename: sanitizedFilePath });
  });

  app.use((err, req, res, next) => {
    console.error("error", err);
    res.status(500).json({
      isSuccess: false,
      status: "FAILURE",
      message: "There is some Technical Problem, please retry again",
      data: {},
    });
  });
};