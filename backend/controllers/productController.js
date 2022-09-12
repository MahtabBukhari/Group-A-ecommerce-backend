//In controller we define the functions of routes

const product = require("../models/productModel");

const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const ApiFeatures = require("../utils/apiFeatures");

// CREATE PRODUCT --- ADMIN
exports.createProduct = catchAsyncError(async (req, res, next) => {

req.body.user = req.user.id;

  const createdProduct = await product.create(req.body);
  res.status(201).json({
    success: true,
    createdProduct,
  });
});

//GET ALL PRODUCTS
exports.getAllProducts = catchAsyncError(async (req, res) => {
  const contentPerPage = 5;

  const productCount = await product.countDocuments();

  const apiFeatures = new ApiFeatures(product.find(), req.query)
    .search()
    .filter()
    .pagination(contentPerPage);
  // const getProducts = await product.find();
  const getProducts = await apiFeatures.query;
  res.status(200).json({ success: true, getProducts });
});
//update the product  -- admin

exports.updateProduct = catchAsyncError(async (req, res, next) => {
  let updateproduct = await product.findById(req.params.id);

  if (!updateproduct) {
    return next(new ErrorHandler("Product Not Found", 404));
    // return res.status(500).json({
    //   success: false,
    //   message: "product not found",
    // });
  }

  updateproduct = await product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    updateproduct,
  });
});

exports.deleteProduct = catchAsyncError(async (req, res, next) => {
  const deletedProduct = await product.findByIdAndRemove(req.params.id);

  if (!deletedProduct) {
    return next(new ErrorHandler("Product Not Found", 404));
    // return res.status(500).json({
    //   success: false,
    //   message: "product not found",
    // });
  }


  res.status(200).json({
    success: true,
    message: "product is deleted successfully",
  });
});

exports.getProductDetails = catchAsyncError(async (req, res, next) => {
  const getOneProduct = await product.findById(req.params.id);

  if (!getOneProduct) {
    //next is a callback function that is used to call the middleware
    return next(new ErrorHandler("Product Not Found", 404));
    // return res.status(500).json({
    //   success:false,
    //   message:"Product Not Found"
    // })
  }

  res.status(200).json({
    success: true,
    getOneProduct,
    productCount
  });
});
