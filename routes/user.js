const express = require("express");

const router = express.Router();

// Importing user contorller
const {
  signUp,
  login,
  logout,
  forgotPassword,
  passwordReset,
} = require("../controllers/usercontroller");

router.route("/signup").post(signUp);

router.route("/login").post(login);

router.route("/logout").get(logout);

router.route("/forgotpassword").post(forgotPassword);

router.route("/password/reset/:token").post(passwordReset);

module.exports = router;
