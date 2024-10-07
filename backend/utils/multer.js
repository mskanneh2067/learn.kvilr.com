import multer from "multer";
import {createError} from "./error.js"
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
        const ext = file.mimetype.split('/')[1];

    //const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, `user-${req.user.id}-${Date.now()}.${ext}`)
    }
  })
  

  const fileFilter = (req,file,cb)=>{
    if(file.mimetype.startsWith('image')){
        cb(null,true);
    } else{
        cb(createError(400,"Not an image! Please uplooad only images"))
    }
  }
  export const upload = multer({ storage,fileFilter})