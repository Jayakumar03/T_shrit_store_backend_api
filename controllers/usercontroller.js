const User = require("../models/user");
// const BigPromise = require("../middlewares/bigPromise");
const customError = require("../utils/customError");
const cookieToken = require("../utils/cookieToken");
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;

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
