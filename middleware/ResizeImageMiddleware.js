const { uploadImageSingleAndResize } = require('./../utils/uploadAndResize')
const sharp = require('sharp')
const asyncHandler = require('./../utils/AsyncMiddlewareHandler')
const { v4: uuidv4 } = require('uuid');
module.exports.resizeImageMiddleware = asyncHandler(async (request, response, next) => {
    if (!request.file) next()
    console.log(request.file)
    const image = await sharp(request.file.buffer).resize(400, 400).toFile(`public/images/resize/${uuidv4()}.${request.file.mimetype.split('/')[1]}`)
    next()
})