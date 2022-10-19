const express = require("express")
const router = express.Router()


const { getVisit, createVisit } = require("../../controller/visit")
const { auth } = require("../../middleware/auth")

// Get Visit Api

router.get("/get", auth, getVisit)

// Create Visit Api

router.post("/create", auth, createVisit)


module.exports = router
