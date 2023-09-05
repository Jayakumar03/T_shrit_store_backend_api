const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middlewares/user");
const { customRole } = require("../middlewares/admin");

const {
  addProduct,
  getAllProduct,
  adminGetAllProduct,
  getOneProduct,
  adminUpdateOneProduct,
  adminDeleteOneProduct,
  addReview,
  deleteReview,
  getOnlyReviewsForOneProduct,
} = require("../controllers/productControllers");

//* userroutes
router.route("/products").get(getAllProduct);
router.route("/product/:id").get(getOneProduct);
router.route("/review").put(isLoggedIn,addReview);
router.route("/review").delete(isLoggedIn,deleteReview);
router.route("/review").get(isLoggedIn,getOnlyReviewsForOneProduct);

//! Admin routes
router
  .route("/admin/product/add")
  .post(isLoggedIn, customRole("admin"), addProduct);

router
  .route("/adminproducts")
  .get(isLoggedIn, customRole("admin"), adminGetAllProduct);

router
  .route("/admin/product/:id")
  .put(isLoggedIn, customRole("admin"), adminUpdateOneProduct)
  .delete(isLoggedIn, customRole("admin"), adminDeleteOneProduct);

module.exports = router;
