const multer = require('multer')
const { v4: uuidv4 } = require('uuid');
const ErrorResponse = require('./../utils/ErrorResponse')
//upload trực tiếp vào thư mục từ ảnh tải lên
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images')
    },
    filename: function (req, file, cb) {
        const ext = file.mimetype.split('/')[1];
        cb(null, `${file.fieldname}-${uuidv4()}.${ext}`)
    }
})



const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) cb(null, true)
    else cb(new ErrorResponse('file ko phai image', 400), false)
}
const upload = multer({
    storage,
    fileFilter,
})
//upload trực tiếp vào thư mục từ ảnh tải lên
module.exports.uploadImageSingle = upload.single('image')
module.exports.uploadImageMultiple = upload.array('images',5) //toi da 5 phan tu
module.exports.uploadImageTwoWay = upload.fields([{ name: 'image', maxCount: 1 }, { name: 'images', maxCount: 5 }])

