
const app = require("./app");
const connectWithDb = require("./config/db");
require("dotenv").config()

// * Connect with database 
connectWithDb()

app.listen(process.env.PORT, () => {
  console.log(`hello for ${process.env.PORT}`);
});