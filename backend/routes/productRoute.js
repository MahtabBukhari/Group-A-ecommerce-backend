const express = require('express');
const {getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetails} = require('../controllers/productController');
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');

const router = express.Router()

router.route('/products').get( getAllProducts)
// isAuthenticatedUser function gives the (user) useing that user in authorizeRole function we check is this is admin or user 
//Only Admin allow to create , update and delete the product 
router.route('/product/create').post(isAuthenticatedUser, authorizeRoles("admin"),createProduct)
router.route('/product/:id').put(isAuthenticatedUser, authorizeRoles("admin"),updateProduct)
router.route('/product/:id').delete(isAuthenticatedUser, authorizeRoles("admin"),deleteProduct)
router.route('/product/:id').get(getProductDetails)


module.exports= router