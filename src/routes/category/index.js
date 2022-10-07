const express = require("express")
const router = express.Router()


const { createCategory, getAllCategory, getCategory, updateCategory, deleteCategory } = require("../../controller/category")

// Get All Category Api

router.get("/all", getAllCategory)

// Get Category Api

router.get("/get", getCategory)

// Create Category Api

router.post("/create", createCategory)


// Update Category Api

router.patch("/update", updateCategory)

// Delete Category Api

router.delete("/delete", deleteCategory)


module.exports = router
