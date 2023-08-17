const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please provide product name"],
    trim: true,
    maxlength: [120, "product name should not be more than 120 characters"],
  },

  price: {
    type: Number,
    required: [true, "please provide product price"],
    trim: true,
    maxlength: [5, "product price should not be more than 5 digits"],
  },

  description: {
    type: String,
    required: [true, "please provide product description"],
  },

  

  photos: [
    {
      id: {
        type: String,
        required: true,
      },

      secure_url: {
        type: String,
        required: true,
      },
    },
  ],

  category: {
    type: String,
    required: [
      true,
      "please select an category form- short-sleeves, long-sleeves, sweat-shrits, hoodies",
    ],
    enum: {
      values: ["shortssleeves", "longsleeves", "sweatshrit", "hoodies"],
      message:
        "please select an category form- short sleeves, long sleeves, sweat-shrits, hoodies",
    },
  },

  brand: {
    type: String,
    required: [true, "please add an brand for the clothing"],
  },

  rating: {
    type: Number,
    default: 0,
  },

  numberOfReviews: {
    type: Number,
    default: 0,
  },

  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: User,
        required: true,
      },

      name: {
        type: String,
        required: true,
      },

      rating: {
        type: Number,
        required: true,
      },

      comment: {
        type: String,
        required: true,
      },
    },
  ],

  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    requried: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Product", productSchema);
