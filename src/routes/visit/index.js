const express = require("express")
const router = express.Router()


const {getVisit, createVisit} = require("../../controller/visit")

// Get Visit Api

router.get("/get", getVisit)

// Create Visit Api

router.post("/create", createVisit)


module.exports = router
