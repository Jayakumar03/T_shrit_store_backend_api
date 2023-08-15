const mongoose = require("mongoose")



const connectWithDb = () => {
    mongoose.connect(process.env.DB_URL)
    .then(() => console.log("DB connected sucessfully"))
    .catch((error) => {
        console.log("DB connection is not sucessfully");
        console.log(error)
    })
}


module.exports = connectWithDb