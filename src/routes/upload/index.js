const express = require("express")
const router = express.Router()
const { upload } = require("../../controller/upload")
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const DIR = '../../../public/';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, uuidv4() + '-' + fileName)
    }
});
var uploadFile = multer({
    storage: storage,
});

router.post("/", uploadFile.single("profile"), upload)

module.exports = router





// Upload Api

router.post("/", upload)



module.exports = router
