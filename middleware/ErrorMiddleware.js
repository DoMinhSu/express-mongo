module.exports = function errorHandler(err, req, res, next) {
     res.status(err.statusCode || 500).json({
        status: err.status,
        statusCode:err.statusCode,
        message: err.message ,
        // name:err.name || '',
        stack :err.stack
    })
}