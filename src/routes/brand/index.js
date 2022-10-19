const express = require("express")
const router = express.Router()

const { createBrand, getAllBrand, getBrand, updateBrand, deleteBrand, getBrandData } = require("../../controller/brand")
const { keyCheck } = require("../../middleware/keyCheck")

// Get All Brand Api

router.get("/all", keyCheck, getAllBrand)

// Get  Brand Api

router.get("/get", keyCheck, getBrand)

// Create Brand Api

router.post("/create", keyCheck, createBrand)


// Update Brand Api

router.post("/update", keyCheck, updateBrand)

// Delete Brand Api

router.post("/delete", keyCheck, deleteBrand)

// Get Brand Data Api

router.get("/data", keyCheck, getBrandData)


module.exports = router
