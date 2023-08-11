
const app = require("./app")
require("dotenv").config()

app.listen(process.env.PORT, () => {
  console.log(`hello for ${process.env.PORT}`);
});