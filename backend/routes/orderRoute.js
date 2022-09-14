const express = require('express');
const { newOrder, getSingleOrder, myOrders, getAllOrders } = require('../controllers/orderController');
const router = express.Router();

const {isAuthenticatedUser,authorizeRoles} = require('../middleware/auth')


router.route('/order/new').post(isAuthenticatedUser, newOrder)

router.route('/order/myOrder').get(isAuthenticatedUser, myOrders)

router.route('/order/:id').get(isAuthenticatedUser,getSingleOrder)

router.route('/order').get(isAuthenticatedUser,authorizeRoles("admin"),getAllOrders)





module.exports=router