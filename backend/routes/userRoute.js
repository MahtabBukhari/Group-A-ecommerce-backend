const express = require('express')
const { registerUser, loginUser, LogoutUser, forgotPassword } = require('../controllers/userController')
const router = express.Router()




router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/password/forgot').post(forgotPassword)
router.route('/logout').get(LogoutUser)


module.exports = router