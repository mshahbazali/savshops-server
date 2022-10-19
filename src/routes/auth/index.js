const express = require("express")
const router = express.Router()
const { admin, me, check, signup, signin, updatepassword, sendotp, checkotp, updateprofile, deleteuser } = require("../../controller/auth")
const { auth } = require("../../middleware/auth")
const { keyCheck } = require("../../middleware/keyCheck")

// Check Api
router.post("/check", check)

// Sign Up Api
router.post("/signup", signup)

// Sign In Api
router.post("/signin", signin)

// Update Profile Api
router.post("/updateprofile", auth, updateprofile)

// Update Password Api
router.post("/updatepassword", updatepassword)

// OTP SEND Api
router.post("/sendotp", sendotp)

// OTP Check Api
router.post("/checkotp", checkotp)

// Delete User Api
router.post("/delete", deleteuser)

// Me User Api
router.get("/me", auth, me)

// Admin Api
router.get("/admin", keyCheck, admin)

module.exports = router


