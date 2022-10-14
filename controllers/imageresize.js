const path = require('path')
const multer = require('multer')
const sizeOf = require('image-size')
const gm = require('gm')

exports.getImageDimensions = async (req, res) => {
    try {
        const dimensions = sizeOf(req.file.path)
        console.log(dimensions.width, dimensions.height)
        res.status(200).json({
            status: "success",
            data: {
                width: dimensions.width,
                height: dimensions.height
            }
        })

    } catch (error) {
        res.status(400).json({
            status: "Fail",
            message: error.message
        })
    }

}

exports.imageResize = async (req, res) => {
    try {
        let width = req.body.width;
        let height = req.body.height;
        console.log(width)
        let image = req.params.path
        console.log(image)

        gm('public/uploads/' + image)
            .resize(width, height)
            .write("output.png", function (err) {
                if (err) res.send(err)
                res.download("output.png")
            })

    } catch (error) {
        console.log(error)
    }
}