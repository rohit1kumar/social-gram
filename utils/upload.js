const cloudinary = require("cloudinary").v2
const multer = require('multer')
const path = require('path')

module.exports = cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})


// const storage = multer.diskStorage({
// destination: function (req, file, cb) {
//     cb(null, './uploads/')
// }
// filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//     cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname)

// }
// filefilter: (req, file, cb) => {
//     let ext = path.extname(file.orignalname)
//     if (ext !== '.jpg' && ext !== 'jpeg' && ext !== '.png') {
//         cb(new Error('file type not supported'), false)
//         return
//     }
//     cb(null, true)
// }

// })
// const upload = multer({ storage: storage })
module.exports = multer({
    storage: multer.diskStorage({}),
    fileFilter: (req, file, cb) => {
        let ext = path.extname(file.originalname);
        if (ext !== ".jpg" && ext == ".jpeg" && ext !== ".png") {
            cb(new Error("File type is not supported"), false);
            return;
        }
        cb(null, true);
    }
});


// module.exports = upload.single('files'), cloudinary

