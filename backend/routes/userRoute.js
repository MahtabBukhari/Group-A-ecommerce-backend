const express = require('express')
const { registerUser, loginUser, LogoutUser, forgotPassword, resetPassword, getUserDetails, updatePassword, updateUserProfile, getAllUser, getSingleUser, updateUserRole, deleteUser } = require('../controllers/userController')
const router = express.Router()
const {isAuthenticatedUser, authorizeRoles} = require('../middleware/auth')




router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/password/forgot').post(forgotPassword)
router.route('/password/reset/:token').put(resetPassword)
router.route('/logout').get(LogoutUser)
router.route('/me').get( isAuthenticatedUser ,getUserDetails)
router.route('/password/update').put( isAuthenticatedUser ,updatePassword)
router.route('/me/update').put( isAuthenticatedUser ,updateUserProfile)
// admin
router.route('/admin/users').get(isAuthenticatedUser, authorizeRoles("admin"),getAllUser)
router.route('/admin/user/:id').get(isAuthenticatedUser, authorizeRoles("admin"),getSingleUser).delete(isAuthenticatedUser, authorizeRoles("admin"),deleteUser)
router.route('/admin/user/:id').put(isAuthenticatedUser, authorizeRoles("admin"),updateUserRole)



module.exports = router