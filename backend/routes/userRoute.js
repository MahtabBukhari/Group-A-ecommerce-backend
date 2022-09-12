const express = require('express')
const { registerUser, loginUser, LogoutUser, forgotPassword, resetPassword, getUserDetails, updatePassword, updateUserProfile } = require('../controllers/userController')
const router = express.Router()
const {isAuthenticatedUser} = require('../middleware/auth')




router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/password/forgot').post(forgotPassword)
router.route('/password/reset/:token').put(resetPassword)
router.route('/logout').get(LogoutUser)
router.route('/me').get( isAuthenticatedUser ,getUserDetails)
router.route('/password/update').put( isAuthenticatedUser ,updatePassword)
router.route('/me/update').put( isAuthenticatedUser ,updateUserProfile)



module.exports = router