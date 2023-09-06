const stripeSceretKey = require("stripe")(process.env.STRIPE_SCERET_KEY);

exports.sendStripeKey = async (req, res, next) => {
  res.status(200).json({
    success: true,
    stripeKey: process.env.STRIPE_API_KEY,
  });
};

exports.captureStripePayment = async (req, res, next) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: req.body.amount,
    currency: "inr",

    // Optional
    metadata: { integration_check: "accept_a_payment" },
  });

  res.status(200).json({
    success: true,
    client_secret: paymentIntent.client_secret,
  });
};

exports.sendRazorpayKey = async (req, res, next) => {
  res.status(200).json({
    success: true,
    stripeKey: process.env.RAZORPAY_API_KEY,
  });
};

exports.captureRazorpayPayment = async (req, res, next) => {
  var instance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_SCERET_KEY,
  });

  const myOrders = await instance.orders.create({
    amount: req.body.amount,
    currency: "INR",
  });

  res.status(200).json({
    success: true,
    myOrders,
    Amount: req.body.amount,
  });
};
