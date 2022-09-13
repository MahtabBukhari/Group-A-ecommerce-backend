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


//Create New reviews or update reviews

exports.createProductReviews= catchAsyncError( async (req,res,next)=>{

  // from front end productId comes which tell us to which product user is commenting
  const {rating,comment,productId}= req.body;
// if we login then our req.user exist
  const review={
    user:req.user._id,
    name:req.user.name,
    rating:Number(rating),
    comment
  }

  const Reviewedproduct = await product.findById(productId)

  // now check is that user allready give review to that product or not
  const isReviewed = Reviewedproduct.reviews.find(rev=> rev.user.toString()=== req.user._id.toString())

  if(isReviewed){

    // this loop will check all reviews user
    Reviewedproduct.reviews.forEach(rev=>{
      if(rev.user.toString()=== req.user._id.toString()){

        rev.rating=Number(rating)
        rev.comment=comment


      }
    })

  }else{
//if that user is not reviewed this product before then simply user review push to the reviews array
    Reviewedproduct.reviews.push(review)
    //as review is in the form of array so array length show how many review given by users to that product
    Reviewedproduct.numOfReviews= Reviewedproduct.reviews.length

  }

  // here we will add all reviews rating of that product
  let avg=0
  Reviewedproduct.reviews.forEach(rev=>{
    avg+=rev.rating
  })

  //here we will store in ratings   the avarage of all rating given to that product
  Reviewedproduct.ratings = avg/ (Reviewedproduct.numOfReviews)

  await Reviewedproduct.save({validateBeforeSave:false})

  res.status(200).json({
    success:true
  })

})