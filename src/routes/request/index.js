const express = require("express")
const router = express.Router()


const { getBrand, createRequest, getRequest } = require("../../controller/request")

// Create Request Api

router.post("/create", createRequest)

// Get Request Api

router.get("/get", getRequest)

// Get Brand Api

router.get("/brand", getBrand)


module.exports = router
