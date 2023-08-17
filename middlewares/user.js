const User = require("../models/user");
const jwt = require("jsonwebtoken");

exports.isLoggedIn = async (req, res, next) => {
  // const token = req.cookie || req.header("Authorization").replace("Bearer", "");
  let token = req.cookies.token;

   // if token not found in cookies, check if header contains Auth field
   if (!token && req.header("Authorization")) {
    token = req.header("Authorization").replace("Bearer ", "");
  }

  if (!token) return next(new Error("Login first to acess this page", 401));

  const decoded = jwt.verify(token, process.env.SECRET_KEY);

  req.user = await User.findById(decoded.id);

  next();
};


