const express = require("express")
const router = express.Router()
const { get } = require("../../controller/notification")
const { auth } = require("../../middleware/auth")

// Get Notification Api

router.get("/get", auth, get)



module.exports = router
