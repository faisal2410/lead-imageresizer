
const express = require('express');
const router = express.Router();
const { uploader } = require("../middlewares/uploader")
const { getImageDimensions }=require("../controllers/imageresize")



router.get("/", (req, res) => {
    res.status(200).json({status:"success",message:"Welcome to image resizer app"})
})

router.post("/image-dimension", uploader, getImageDimensions)

module.exports = router;
