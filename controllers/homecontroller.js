const BigPromise = require("../middlewares/bigPromise")


// ! Example for Promise way
exports.home = BigPromise(async(req, res) => {
  res.status(200).json({
    success: true,
    greeting: "hello form API",
  });
});


// * try catch and async and await
exports.homeDummy = async(req, res) => {
  try {
    res.status(200).json({
      success: true,
      greeting: "THis is an another time",
    });
    
  } catch (error) {
    console.log(error)
    
  }
  
};
