const express = require("express")
const router = express.Router()

const { approve, reject, create, get } = require("../../controller/withdrew")

// Create Withdrew Api

router.post("/create", create)

// Get Withdrew Api

router.get("/get", get)

// Approve Withdrew Api

router.post("/approve", approve)

// Reject Withdrew Api

router.post("/reject", reject)



module.exports = router
