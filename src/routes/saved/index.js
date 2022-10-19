const express = require("express")
const router = express.Router()

const { getAll, create, get } = require("../../controller/saved")
const { auth } = require("../../middleware/auth")

// Create Saved Api

router.post("/create", auth, create)

// Get Saved Api

router.get("/get", auth, get)

// Get All Saved Api

router.get("/getall", auth, getAll)




module.exports = router
