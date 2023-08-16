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
} = require("../controllers/usercontroller");

router.route("/signup").post(signUp);

router.route("/login").post(login);

router.route("/logout").get(logout);

router.route("/forgotpassword").post(forgotPassword);

router.route("/password/reset/:token").post(passwordReset);

router.route("/userdashboard").get(isLoggedIn, getLoggedInUserDetails);

router.route("/password/update").post(changePassword);

module.exports = router;
