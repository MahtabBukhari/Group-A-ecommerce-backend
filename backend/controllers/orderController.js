const Order = require("../models/orderModel");
const product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const { rawListeners } = require("../models/userModel");

exports.newOrder = catchAsyncError(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    user: req.user._id,
    paidAt: Date.now(),
  });

  res.status(200).json({ success: true, order });
});


//Get single order 

exports.getSingleOrder = catchAsyncError( async(req,res,next)=>{

  //in Order model only user id present if we want to get the user data from that id then we use (populate) function
  const order = await Order.findById(req.params.id).populate("user","name email")
                                                           // user that is in Schema
   if(!order){
    return next(new ErrorHandler("Order Not Found",404))
   }

   res.status(200).json({
    success:true,
    order
  })
})



//user own order

exports.myOrders = catchAsyncError( async( req, res, next)=>{

  const orders = await Order.find({user:req.user.id})

  res.status(200).json({
    success:true,
    orders
  })
})
