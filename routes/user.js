const express = require("express");
const { isLoggedIn } = require("../middlewares/user");
const router = express.Router();

// Importing user contorller
const {
  signUp,
  login,
  logout,
  forgotPassword,
  passwordReset,
  getLoggedInUserDetails,
  changePassword,
  updateUserDetails
} = require("../controllers/usercontroller");

router.route("/signup").post(signUp);

router.route("/login").post(login);

router.route("/logout").get(logout);

router.route("/forgotpassword").post(forgotPassword);

router.route("/password/reset/:token").post(passwordReset);

router.route("/userdashboard").get(isLoggedIn, getLoggedInUserDetails);

router.route("/password/update").put(isLoggedIn,changePassword);

router.route("/userdashboard/update").put(isLoggedIn, updateUserDetails);








module.exports = router;
