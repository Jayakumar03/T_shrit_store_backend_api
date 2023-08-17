const User = require("../models/user");
const customError = require("../utils/customError");
const cookieToken = require("../utils/cookieToken");
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;
const { mailHelper } = require("../utils/mailHelper");
const crypto = require("crypto");



exports.adminAllUser = async (req, res, next) => {
    try {
        console.log(2.1)
        const users = await User.find() // Since find method is empty it will fetch all the users


        console.log(3)
        res.status(200).json({
            success:true,
            users
        })


        
    } catch (error) {
        console.log(error)
        
    }
}


exports.gettingOneUser = async (req, res, next) => {
    try {
        
        const user = await User.findById(req.params.id) 

        if(!user) return next(new Error ("You cannot access this resource"))

        res.status(200).json({
            success:true,
            user
        })


        
    } catch (error) {
        console.log(error)
        
    }
}

exports.adminUpdateOneUserDetails = (async (req, res, next) => {
    // add a check for email and name in body
  
    // collect data from body
    const newData = {
      name: req.body.name,
      email: req.body.email,
      role : req.body.role
    };
  
    // update the data in user
    const user = await User.findByIdAndUpdate(req.params.id, newData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

  
    res.status(200).json({
      success: true,
      user
    });
  });

//   await Test.deleteOne({ _id: entry._id });

exports.deleteUser = (async (req, res, next) => {  
    // update the data in user
    const user = await User.deleteOne({_id:req.params.id});

    res.status(200).json({
      success: true,
      user
    });
  });


exports.manager = async (req, res, next) => {
    try {
        const users = await User.find({role:"user"}) // Since find method is empty it will fetch all the users

        res.status(200).json({
            success:true,
            users
        })


        
    } catch (error) {
        console.log(error)
        
    }
}

