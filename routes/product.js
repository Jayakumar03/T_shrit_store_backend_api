const express = require("express");
const router = express.Router();


const {testProduct} = require("../controllers/productControllers")


router.route("/testproduct").get(testProduct)



module.exports = router