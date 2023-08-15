const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "PLease provide your name"],
    maxlength: [40, "Name should be of 40 characters"],
  },

  email: {
    type: String,
    required: [true, "PLease provide your email"],
    validate: [validator.isEmail, "Please enter email in corrrect format"],
    unique: true,
  },

  password: {
    type: String,
    required: [true, "PLease provide your password"],
    minlength: [6, "password should be of 6 characters"],
    select: false,
  },

  role: {
    type: String,
    default: "user",
  },

  photo: {
    id: {
      type: String,
      required: true,
    },

    secure_url: {
      type: String,
      required: true,
    },
  },

  forgotPasswordToken: String,
  forgotPasswordExpiry: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// * Encrypt Password before save == Pre Hooks
userSchema.pre("save", async function () {
  // ismodified will return true  if the password field changed or if new password is provided
  // for new password is given => true => !true = false => will not enter the if
  // if only name or email has been changed => false => !false => true => Enter the if statement => return()
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 10);
});

// * Checking the password is correct
userSchema.methods.isValidatedPassword = async function (userSendPassword) {
  return await bcrypt.compare(userSendPassword, this.password);
};

// * Creating and returning an JWT  magazine to keep it loaded token
userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.SECRET_KEY, {
    expiresIn: process.env.EXPIRY,
  });
};

//  * Creating forgot password token and only sending the token not the hashed value. It will be stored in DB. But user provide the token, We need to
// *  hash it compare with the token in the backend
userSchema.methods.getForgotPasswordToken = function () {
  const forgotToken = crypto.randomBytes(20).toString("hex");
  // Getting a hash = make sure to get a hash on backend
  this.forgotPasswordToken = crypto
    .createHash("sha256")
    .update(forgotToken)
    .digest("hex");

  this.forgotPasswordExpiry = Date.now() + 20 * 60 * 1000;

  return forgotToken;
};

module.exports = mongoose.model("User", userSchema);
