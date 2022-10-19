const express = require("express")
const router = express.Router()

const { approve, reject, create, get } = require("../../controller/withdrew")
const { auth } = require("../../middleware/auth")
const { keyCheck } = require("../../middleware/keyCheck")

// Create Withdrew Api

router.post("/create", auth, create)

// Get Withdrew Api

router.get("/get", auth, get)

// Approve Withdrew Api

router.post("/approve", keyCheck, approve)

// Reject Withdrew Api

router.post("/reject", keyCheck, reject)



module.exports = router
