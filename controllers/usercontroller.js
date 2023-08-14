const User = require("../models/user");

const BigPromise = require("../middlewares/bigPromise");

exports.signUp = BigPromise(async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      greeting: "THis is form sign up",
    });
  } catch (error) {
    console.log(error);
  }
});
