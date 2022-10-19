const express = require("express")
const router = express.Router()


const { approve, reject, getBrand, createRequest, getRequest } = require("../../controller/request")
const { auth } = require("../../middleware/auth")
const { keyCheck } = require("../../middleware/keyCheck")

// Create Request Api

router.post("/create", auth, createRequest)

// Get Request Api

router.get("/get", auth, getRequest)

// Get Brand Api

router.get("/brand", auth, getBrand)

// Approve Request Api

router.post("/approve", keyCheck, approve)

// Reject Request Api

router.post("/reject", keyCheck, reject)


module.exports = router
