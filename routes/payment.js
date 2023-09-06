const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middlewares/user");

const {
    sendRazorpayKey,
    sendStripeKey,
    captureStripePayment,
    captureRazorpayPayment,
  } = require("../controllers/paymentController");



  router.route("/stripekey").get(isLoggedIn, sendStripeKey);
  router.route("/razorpaykey").get(isLoggedIn, sendRazorpayKey);
  
  router.route("/capturestripe").post(isLoggedIn, captureStripePayment);
  router.route("/capturerazorpay").post(isLoggedIn, captureRazorpayPayment);











module.exports = router;
