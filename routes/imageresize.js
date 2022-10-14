const express = require('express');
const router = express.Router();
const { imageDimensions,imageResize,imageCompressor }=require("../controllers/imageresize")

router.get("/", (req, res) => {
    res.status(200).json({status:"success",message:"Welcome to image re-sizer app"})
})
router.post("/image-upload",imageDimensions);
router.post("/resize/:path",imageResize);
router.post("/compress/uploads",imageCompressor)



module.exports = router;
