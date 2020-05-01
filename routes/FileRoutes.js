var express = require('express');
var router = express.Router();

const path = require('path')
const multer = require('multer')
//các cách lưu ảnh: buffer trong db,di chuyển ảnh vào thư mục,di chuyển vào dịch vụ bên thứ 3
//để lấy ảnh từ buffer trong db ra làm img : set content type trả về là img và dùng base 64 để hiển thị 
//fs đọc file rồi require(‘mongodb’).Binary; chuyển qua buffer rồi lưu vào db
upload = multer({ 
    dest: 'uploads/', 
    limits: {
        fileSize:1024 * 1000 //10mb
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('hay upload file anh'))
            //thay bằng err response
        }
        cb(undefined,true)
        console.log(file)
    }
})

router.post('/upload-with-formiable', function (req, res, next) {
    const formidable = require('formidable')
    const form = formidable(
        {
            encoding: 'utf-8',
            multiples: true,
            uploadDir: path.join(__dirname, '../public/images'),
            keepExtensions: true,
            maxFileSize: 20 * 1024 * 1024,//20 mb
        }
    )
    form.parse(req, function (err, fields, files) {
        if (err) return res.status(400).json({ status: "fail" })
        return res.status(400).json({ status: "success" })
    });
    form.on('end', () => {
        console.log('end')
    });
});
router.post('/upload-with-multer',
upload.single('image'),
(req,res,next)=>{
    console.log(req.file)
    res.status(200).json({
        status:"success",
    })

})


module.exports = router;
