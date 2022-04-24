require("dotenv").config();

const http = require("http");
const https = require("https");
const fs = require("fs");

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");

const app = express();

app.use(
  cors({
    origin: "*",
  })
);

// Middleware Sections
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Routes
app.use(require("./src/routes/index"));

// Statict Content
app.use(express.static(path.join(__dirname, "public")));

// for ssh
const options = {
  key: fs.readFileSync("./CA/localhost/localhost.decrypted.key"),
  cert: fs.readFileSync("./CA/localhost/localhost.crt"),
};

// https server
https
  .createServer(options, app)
  .listen(process.env.PORT, process.env.HOST, () => {
    console.log("Server started");
  });

// http server
http.createServer(app).listen(+process.env.PORT + 1, () => {
  console.log("Server started");
});
