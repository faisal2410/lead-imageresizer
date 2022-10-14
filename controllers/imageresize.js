const multer = require('multer')
const sizeOf = require('image-size')
const gm = require('gm')
const imagemin = require("imagemin");
const imageminJpegtran = require("imagemin-jpegtran");
const imageminPngquant = require("imagemin-pngquant");



exports.imageDimensions = async (req, res) => {   
    try {
        const storage=multer.diskStorage({
          destination: (req,file,callBack)=> {
              callBack(null,'public/uploads');
          },
          filename: (req,file,callBack)=> {
              callBack(null,file.originalname)
          }    
          
      });
      const maxSize = 5 * 1024 * 1024; // for 5MB  
      const upload=multer({
        storage:storage,
        fileFilter: (req, file, cb)=> {
          if(file.mimetype==="image/jpg"||
            file.mimetype==="image/png"||
            file.mimetype==="image/jpeg"||
            file.mimetype==="image/webp"      
          ){
            cb(null, true)
          }else{
            cb(null, false);
            return cb(new Error("Only jpg, png, jpeg and webp format is allowed"))
          }
        },
        limits: { fileSize: maxSize }
      }).single('image')
      upload(req,res, (error)=> {  
        console.log("req.fields", req.body);
        console.log("req.files", req.file);
        
        const dimensions = sizeOf(req.file.path)
        console.log(dimensions.width, dimensions.height)
        res.status(200).json({
            status: "success",
            data: {
                width: dimensions.width,
                height: dimensions.height
            }
        })
      
    
    
        if (error instanceof multer.MulterError) {        
          res.status(400).json({
            status:"Fail",
            message:error.message
          })
        } else if (error) {      
          res.status(400).json({
            status:"Fail",
            message:error.message
          })
        } 
    });   
      } catch (err) {
        console.log(err);
        res.status(400).json({
          err: err.message,
        });
      }

}

// image Resize function is not working
exports.imageResize = async (req, res) => {
    try {
        let width = req.body.width;
        let height = req.body.height;
        console.log(width)
        let image = req.params.path
        console.log(image)

        gm('public/uploads/' + image)      
            .resize(width, height)
            .write("bonus.png", function (err) {
                console.log(err)
                if (err) res.send(err)
                res.download("bonus.png")
            })

    } catch (error) {
        console.log(error)
    }
}


exports.imageCompressor = async (req, res) => {   
  try {
      const storage=multer.diskStorage({
        destination: (req,file,callBack)=> {
            callBack(null,'public/uploads');
        },
        filename: (req,file,callBack)=> {
            callBack(null,file.originalname)
        }    
        
    });
    const maxSize = 5 * 1024 * 1024; // for 5MB  
    const upload=multer({
      storage:storage,
      fileFilter: (req, file, cb)=> {
        if(file.mimetype==="image/jpg"||
          file.mimetype==="image/png"||
          file.mimetype==="image/jpeg"||
          file.mimetype==="image/webp"      
        ){
          cb(null, true)
        }else{
          cb(null, false);
          return cb(new Error("Only jpg, png, jpeg and webp format is allowed"))
        }
      },
      limits: { fileSize: maxSize }
    }).single('image')
    upload(req,res, async(error)=> {  
      // console.log("req.fields", req.body);
      // console.log("req.files", req.file);
      
      const files = await imagemin(['public/uploads/*.{jpg,png,jpeg,webp}'], {
              destination: 'public/uploads',
              plugins: [
                imageminJpegtran(),
                imageminPngquant({
                  quality: [0.6, 0.8]
                })
              ]
            });
            // console.log("======>",files);
          
              res.download(files[0].destinationPath);
    
  
  
      if (error instanceof multer.MulterError) {        
        res.status(400).json({
          status:"Fail",
          message:error.message
        })
      } else if (error) {      
        res.status(400).json({
          status:"Fail",
          message:error.message
        })
      } 
  });   
    } catch (err) {
      console.log(err);
      res.status(400).json({
        err: err.message,
      });
    }

}