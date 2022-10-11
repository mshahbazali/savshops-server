const express = require("express")
const router = express.Router()

const { createBrand, getAllBrand, getBrand, updateBrand, deleteBrand, getBrandData } = require("../../controller/brand")

// Get All Brand Api

router.get("/all", getAllBrand)

// Get  Brand Api

router.get("/get", getBrand)

// Create Brand Api

router.post("/create", createBrand)


// Update Brand Api

router.post("/update", updateBrand)

// Delete Brand Api

router.post("/delete", deleteBrand)

// Get Brand Data Api

router.get("/data", getBrandData)


module.exports = router
