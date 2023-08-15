const User = require("../models/user");
// const BigPromise = require("../middlewares/bigPromise");
const customError = require("../utils/customError");
const cookieToken = require("../utils/cookieToken");
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;
const { mailHelper } = require("../utils/mailHelper");

exports.signUp = async (req, res, next) => {
  try {
    let result;

    let file = req.files.photo;
    const { name, email, password } = req.body;

    if (!req.files) {
      throw next(new customError("Photo is required for signup", 400));
    }

    if (!email || !name || !password) {
      return next(new customError("name,email,password are required", 400));
    }

    result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: "users",
      width: 150,
      crop: "scale",
    });

    // Wait for the User.create promise to resolve and get the user object
    const user = await User.create({
      name,
      email,
      password,
      photo: {
        id: result.public_id,
        secure_url: result.secure_url,
      },
    });

    cookieToken(user, res);
  } catch (error) {
    console.log(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    // De-struturing user for request body
    const { email, password } = req.body;

    // IF user is not throw an erro message

    if (!email || !password)
      return next(new Error("Require email or password to login in", 400));

    // seaching for user in DB using finfone method

    const user = await User.findOne({ email }).select("+password");

    // If user is not in DB throw an error

    if (!user) return next(new Error("You are not an registerd user", 400));

    // Cheking the password using is validatedPassword methods
    const isPasswordCorrect = await user.isValidatedPassword(password);

    // If password does not match throw an error

    if (!isPasswordCorrect)
      return next(new Error("You are password is wrong", 400));

    // Creating and jsonwebtoken
    cookieToken(user, res);
  } catch (error) {
    console.log(error);
  }
};

exports.logout = async (req, res, next) => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });

    res.status(200).json({
      sucess: true,
      message: "Logout Success",
    });
  } catch (error) {}
};

// Todo: Solve this error
// Error
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user)
      return next(new Error("Email not verified as registerd user", 400));

    const forgotToken = user.getForgotPasswordToken();

    await user.save({ validateBeforeSave: false });

    const myUrl = `${req.protocol}://${req.get(
      "host"
    )}/password/reset/${forgotToken}`;

    const message = `copy paste this link in your url and hit enter \n\n ${myUrl}`;

    try {
      await mailHelper({
        email: user.email,
        subject: "T-store - Password reset email",
        message,
      });

      res.status(200).json({
        success: true,
        message: "Email sent successfully",
      });

      console.log(1);
    } catch (error) {
      user.getForgotPasswordToken = undefined;
      user.getForgotPasswordToken = undefined;
      await user.save({ validateBeforeSave: false });

      return next(new Error(error.message, 500));
    }
  } catch (error) {
    console.log(error);
  }
};
