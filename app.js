const express = require("express");
const path = require("path");
const multer = require("multer");
const uuidv4 = require("uuid/v4");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, uuidv4());
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
    cb(null, true);
  } else cb(null, false);
};

const feedRoutes = require("./routes/feed");
const authRoutes = require("./routes/auth");
const statusRoutes = require("./routes/status");

app.use(bodyParser.json()); //application/json

app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);

app.use("/images", express.static(path.join(__dirname, "images")));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization"); //to Authorization jest wazne do JWT
  next();
});

app.use("/feed", feedRoutes);
app.use("/auth", authRoutes);
app.use("/status", statusRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});
mongoose
  .connect("mongodb://localhost/PostsApp", {
    useNewUrlParser: true
  })
  .then(result => {
    const server = app.listen(8080);
    const io = require("./socket").init(server);
    io.on("connection", socket => {
      console.log("Client Connected!");
    });
  })
  .catch(err => console.log(err));