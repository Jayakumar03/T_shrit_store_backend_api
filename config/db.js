const mongoose = require("mongoose");

const connectWithDb = () => {
  mongoose
    .connect(process.env.DB_URL)
    .then(() => console.log("DB connected sucessfully"))
    .catch((error) => {
      console.log("DB connection is not sucessfully");
      console.log(error);
    });
};

// const connectWithDb = async () => {
//     try {
//       const conn = await mongoose.connect(process.env.DB_URL);
//       console.log(`MongoDB Connected: ${conn.connection.host}`);
//     } catch (error) {
//       console.log(error);
//       process.exit(1);
//     }
//   }

module.exports = connectWithDb;
