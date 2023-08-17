const express = require("express");
const { isLoggedIn } = require("../middlewares/user");
const {customRole}  = require("../middlewares/admin")
const router = express.Router();

const {adminAllUser, manager, gettingOneUser, adminUpdateOneUserDetails, deleteUser} = require("../controllers/adminController")



router.route("/admin/users").get(isLoggedIn,customRole("admin"), adminAllUser);

router.route("/admin/user/:id")
.get(isLoggedIn,customRole("admin"), gettingOneUser)
.put(isLoggedIn,customRole("admin"), adminUpdateOneUserDetails)
.delete(isLoggedIn,customRole("admin"), deleteUser)


// * Manager only route
router.route("/manager/users").get(isLoggedIn,customRole("manager"), manager);






module.exports = router;