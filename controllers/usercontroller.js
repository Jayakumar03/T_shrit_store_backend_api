const User = require("../models/user");
const BigPromise = require("../middlewares/bigPromise");
const CustomeError = require("../utils/customError");
const CookieToken = require("../utils/cookieToken");

exports.signUp = BigPromise(async (req, res, next) => {
  // Getting name,email,password

  const { name, email, password } = req.body;

  if (!email || !name || !password) {
    return new CustomeError("name,email,password are required", 400);
  }

  const user = User.create({
    name,
    email,
    password,
  });

  CookieToken(user, res)
});
