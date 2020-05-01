var express = require('express');
var router = express.Router();
const {login,logout,getMe,forgotPassword} = require('../controllers/AuthController')

router.route('/login')
        .post(login)
router.route('/logout')
        .get(logout)
router.route('/me')
        .get(getMe)
router.route('/forgot-password')
        .post(forgotPassword)
module.exports = router;
