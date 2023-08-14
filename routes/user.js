const express = require("express");

const router = express.Router();

// Importing user contorller
const { signUp } = require("../controllers/usercontroller");


router.route("/signup").get(signUp)











module.exports = router;