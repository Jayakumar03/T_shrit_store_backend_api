const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middlewares/user");
const { customRole } = require("../middlewares/admin");

const {
  addProduct,
  getAllProduct,
} = require("../controllers/productControllers");

// * userroutes
router.route("/product").get(getAllProduct);

// ! Admin routes
router
  .route("/admin/product/add")
  .post(isLoggedIn, customRole("admin"), addProduct);

module.exports = router;
