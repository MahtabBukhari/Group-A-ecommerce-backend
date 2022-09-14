const express = require('express');
const { newOrder, getSingleOrder, myOrders, getAllOrders, updateOrder } = require('../controllers/orderController');
const router = express.Router();

const {isAuthenticatedUser,authorizeRoles} = require('../middleware/auth')


router.route('/order/new').post(isAuthenticatedUser, newOrder)

router.route('/orders/myOrder').get(isAuthenticatedUser, myOrders)

router.route('/order/:id').get(isAuthenticatedUser,getSingleOrder)

router.route('/admin/order').get(isAuthenticatedUser,authorizeRoles("admin"),getAllOrders)

router.route('/admin/order/:id').put(isAuthenticatedUser,authorizeRoles("admin"),updateOrder)




module.exports=router