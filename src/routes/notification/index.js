const express = require("express")
const router = express.Router()

const { get } = require("../../controller/notification")

// Get Notification Api

router.get("/get", get)



module.exports = router
