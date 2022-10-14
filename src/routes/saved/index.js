const express = require("express")
const router = express.Router()

const { getAll, deleteSaved, create, get } = require("../../controller/saved")

// Create Saved Api

router.post("/create", create)

// Get Saved Api

router.get("/get", get)

// Delete Saved Api

router.post("/delete", deleteSaved)

// Get All Saved Api

router.get("/getall", getAll)




module.exports = router
