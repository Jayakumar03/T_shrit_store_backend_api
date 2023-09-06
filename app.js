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

const PORT = process.env.PORT || 5000;

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
const admin = require("./routes/admin");
const product = require("./routes/product");
const payment = require("./routes/payment");
const order = require("./routes/order");

// Router Middleware
app.use("/api/v1", home);
app.use("/api/v1", user);
app.use("/api/v1", admin);
app.use("/api/v1", product);
app.use("/api/v1", payment);
app.use("/api/v1", order);

app.get("/signuptest", (req, res) => {
  res.render("signuptest");
});

// ? Exporting to index.js
module.exports = app;
