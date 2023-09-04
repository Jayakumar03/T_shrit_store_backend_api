const app = require("./app");
const connectWithDb = require("./config/db");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

// * Connect with database
connectWithDb();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.listen(process.env.PORT, () => {
  console.log(`hello for ${process.env.PORT}`);
});
