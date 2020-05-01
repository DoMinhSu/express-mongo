const multer = require('multer')
const sharp = require('sharp')
const ErrorResponse = require('./ErrorResponse')
// tạo buffer cho upload
const storage = multer.memoryStorage()


const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) cb(null, true)
    else cb(new ErrorResponse('file ko phai image', 400), false)
}
const upload = multer({
    storage,
    fileFilter,
})
//upload trực tiếp vào thư mục từ ảnh tải lên
module.exports.uploadImageSingleAndResize = upload.single('image')
module.exports.uploadImageMultipleAndResize = upload.array('images',5) //toi da 5 phan tu
module.exports.uploadImageTwoWayAndResize = upload.fields([{ name: 'image', maxCount: 1 }, { name: 'images', maxCount: 5 }])

