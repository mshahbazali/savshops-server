const express = require("express")
const router = express.Router()
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const { me, check, upload, signup, signin, updatepassword, sendotp, checkotp, updateprofile, deleteuser } = require("../../controller/auth")



const DIR = './public/';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, uuidv4() + '-' + fileName)
    }
});
var uploadFile = multer({
    storage: storage,
});





// Check Api
router.post("/check", check)

// Sign Up Api
router.post("/signup", signup)

// Sign In Api
router.post("/signin", signin)

// Update Profile Api
router.post("/updateprofile", updateprofile)

// Update Password Api
router.post("/updatepassword", updatepassword)

// OTP SEND Api
router.post("/sendotp", sendotp)

// OTP Check Api
router.post("/checkotp", checkotp)

// Delete User Api
router.post("/delete", deleteuser)

// Me User Api
router.get("/me", me)

// Upload Image Api
router.post("/upload", uploadFile.single("image"), upload)

module.exports = router


