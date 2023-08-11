const express = require("express");

const router = express.Router();

// Importing home contorller
const { home, homeDummy } = require("../controllers/homecontroller");

router.route("/").get(home);
router.route("/homedummy").get(homeDummy);


module.exports = router;
