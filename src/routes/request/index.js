const express = require("express")
const router = express.Router()


const { approve, reject, getBrand, createRequest, getRequest } = require("../../controller/request")

// Create Request Api

router.post("/create", createRequest)

// Get Request Api

router.get("/get", getRequest)

// Get Brand Api

router.get("/brand", getBrand)

// Approve Request Api

router.get("/approve", approve)

// Reject Request Api

router.get("/reject", reject)


module.exports = router
