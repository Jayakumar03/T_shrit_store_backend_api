const express = require("express");

const router = express.Router();

// Importing user contorller
const { signUp, login } = require("../controllers/usercontroller");


router.route("/signup").post(signUp)


router.route("/login").post(login);








module.exports = router;