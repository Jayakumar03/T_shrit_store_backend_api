const mongoose = require("mongoose");
const { use } = require("../app");

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
userSchema.pre("save", async function(){
    // ismodified will return true  if the password field changed or if new password is provided
    // for new password is given => true => !true = false => will not enter the if
    // if only name or email has been changed => false => !false => true => Enter the if statement => return() 
    if(!this.isModified("password")){ 

        return next()
    }

    this.password = await bcrypt.hash(this.password,10);

})



module.exports  = mongoose.Model("User", userSchema)


