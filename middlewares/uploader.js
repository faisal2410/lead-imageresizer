const multer = require('multer')
exports.uploader = async (req, res, next) => {
    try {
        const storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, 'public/uploads')
            },
            filename: function (req, file, cb) {
                cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
            }
        })

        const upload = multer({
            storage: storage
        })

        upload.single('image')
        next();
           
    } catch (error) {
        res.status(400).json({
            status: "Fail",
            message: error.message
        })
    }
}