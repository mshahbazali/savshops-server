const express = require("express")
const router = express.Router()

const { create, get } = require("../../controller/withdrew")

// Create Withdrew Api

router.post("/create", create)

// Get Withdrew Api

router.get("/get", get)


module.exports = router
