const asyncHandler = require('../utils/AsyncMiddlewareHandler')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { ObjectID } = require('mongodb')
const cryptoRandomString = require('crypto-random-string');
const sendEmail = require('../utils/SendEmail');

exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new Error('Please provide an email and password'));
    }

    const { db } = req.app.locals
    const user = await db.collection('users').findOne({ email: email })

    if (!user) {
        next(new Error('User doesnt exist!!!'));
    }
    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        next(new Error('Invalid credentials'));
    }

    sendTokenResponse(user, 200, res);
});

exports.logout = asyncHandler(async (req, res, next) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        data: {}
    });
});

exports.getMe = asyncHandler(async (req, res, next) => {
    const { db } = req.app.locals;
    const user = await db.collection('users').findOne({ _id: new ObjectID(req.user._id) })
    if (user === null) return res.status(200).json({ success: false })

    return res.status(200).json({
        success: true,
        user: user
    });
});

const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = jwt.sign({ user }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });

    const options = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    };

    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }

    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token
        })
}
exports.forgotPassword = asyncHandler(async (req, res, next) => {
    //chưa check là email
   
    const { db } = req.app.locals;
    //create reset password token 
    const token = cryptoRandomString({ length: 64 });
    const expire = Date.now() + 10 * 60 * 1000;
    try {
        const user = await db.collection('users').findOneAndUpdate({ email: req.body.email }, { $set: { reset_password: { token, expire } } })
        // Create reset url
        const resetUrl = `${req.protocol}://${req.get(
            'host'
        )}/auth/reset-password/${token}`;

        const message = `Truy cap ${resetUrl} để đặt lại password`;

        await sendEmail({
            email: user.email,
            subject: 'Password reset token',
            message
        });

        return res.status(200).json({ success: true, message: 'Đã send mail',user })

    } catch (error) {
        next(error)
        // next(new Error('người dùng ko tồn tại hoặc quá trình gửi mail bị lỗi hãy thao tác lại'))
    }
    
})