const express = require("express")
const router = express.Router()


const { createCategory, getAllCategory, getCategory, updateCategory, deleteCategory } = require("../../controller/category")
const { keyCheck } = require("../../middleware/keyCheck")

// Get All Category Api

router.get("/all", keyCheck, getAllCategory)

// Get Category Api

router.get("/get", keyCheck, getCategory)

// Create Category Api

router.post("/create", keyCheck, createCategory)


// Update Category Api

router.patch("/update", keyCheck, updateCategory)

// Delete Category Api

router.delete("/delete", keyCheck, deleteCategory)


module.exports = router
