const User = require("../models/user");



exports.customRole = (...roles) => {
    return(req,res, next) => {
        const role = "admin"
        if(!roles.includes(req.user.role)) return next(new Error("You cannot acccess this resource"));
        next()
    }
}