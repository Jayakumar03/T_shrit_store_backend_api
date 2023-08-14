require("dotenv").config();

const express = require("express");
const app = express();
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");

// ? cookie and file Middleware
app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// ? View engine
app.set("view engine", "ejs");

const PORT = process.env.PORT || 4000;

// ? Regular Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// For swagger documentation
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//? morgan middleware
app.use(morgan("tiny"));

// Import all routes here
const home = require("./routes/home");
const user = require("./routes/user");

// Router Middleware
app.use("/api/v1", home);
app.use("/api/v1", user);

app.get("/signuptest", (req, res) => {
  res.render("signuptest");
});

// ? Exporting to index.js
module.exports = app;
