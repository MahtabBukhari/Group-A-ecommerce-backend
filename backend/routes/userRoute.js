const express = require('express')
const { registerUser, loginUser, LogoutUser } = require('../controllers/userController')
const router = express.Router()




router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/logout').get(LogoutUser)


module.exports = router