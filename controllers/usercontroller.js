const User = require("../models/user");
// const BigPromise = require("../middlewares/bigPromise");
const customError = require("../utils/customError");
const cookieToken = require("../utils/cookieToken");
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;
const { mailHelper } = require("../utils/mailHelper");
const crypto = require("crypto");

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

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user)
      return next(new Error("Email not verified as registerd user", 400));
    
    const forgotToken = user.getForgotPasswordToken();
    
    console.log(forgotToken)

    await user.save({ validateBeforeSave: false });


    const myUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/password/reset/${forgotToken}`;

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

    } catch (error) {
      user.forgotPasswordToken = undefined;
      user.forgotPasswordExpiry = undefined;
      await user.save({ validateBeforeSave: false });

      return next(new Error(error.message, 500));
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.passwordReset = async (req, res, next) => {
  try {
    const token = req.params.token;
    console.log(token)

    const encryToken = crypto.createHash("sha256").update(token).digest("hex");

    console.log("encry",encryToken)

    const user = await User.findOne({
      forgotPasswordToken: encryToken,
      forgotPasswordExpiry: { $gt: Date.now() },
    });

    console.log(user)


    if (!user)
      return next(new Error("Token is either invalid or expired", 400));

    if (req.body.password !== req.body.confirmPassword)
      return next(new Error("password and confirm password do not match", 400));

    let password = req.body.password;

    user.password = password;

    user.forgotPasswordToken = undefined;
    user.forgotPasswordToken = undefined;

    await user.save();

    cookieToken(user,res );
  } catch (error) {
    console.log(error);
  }
};


exports.getLoggedInUserDetails = async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    sucess: true,
    user,
  });
};


exports.changePassword = async (req, res, next) => {
  const userId = req.user._id;
  console.log(userId)

  const user = await User.findById(userId).select("+password");

  const isOldPasswordCorrect = await user.isValidatedPassword(
    req.body.oldPassword
  );

  if (!isOldPasswordCorrect) {
    return next(new Error("Old is password is incorrect"));
  }

  user.password = req.body.oldPassword;

  await user.save();

  cookieToken(user, res);
};


exports.updateUserDetails = (async (req, res, next) => {
  // add a check for email and name in body

  // collect data from body
  const newData = {
    name: req.body.name,
    email: req.body.email,
  };

  // if photo comes to us
  if (req.files) {
    try {
      const user = await User.findById(req.user.id);

    const imageId = user.photo.id;

    // delete photo on cloudinary
    const resp = await cloudinary.uploader.destroy(imageId);

    // upload the new photo
    const result = await cloudinary.uploader.upload(
      req.files.photo.tempFilePath,
      {
        folder: "users",
        width: 150,
        crop: "scale",
      }
    );

    // add photo data in newData object
    newData.photo = {
      id: result.public_id,
      secure_url: result.secure_url,
    };
  }
  catch (error) {
    console.log(error)
      
    }
  }
  // update the data in user
  const user = await User.findByIdAndUpdate(req.user.id, newData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    user
  });
});

