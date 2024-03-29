const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const crypto = require("crypto");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const { findById } = require("../models/userModel");
const { runInThisContext } = require("vm");

exports.registerUser = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;
  const createUser = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "public_id",
      url: "urlavatar",
    },
  });
  // const token = createUser.getJWTToken()

  //     res.status(201).json({success:true,token})

  sendToken(createUser, 201, res);
});

exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  // if email or password not enters
  if (!email || !password) {
    return next(new ErrorHandler("Please Enter Email or Password", 400));
  }

  const userLogin = await User.findOne({ email }).select("+password");

  //if user not exist mean email not exist
  if (!userLogin) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  const isPasswordMatch = await userLogin.comparePassword(password);

  //if password is not match then
  if (!isPasswordMatch) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  // const token  = userLogin.getJWTToken()
  //     res.status(201).json({success:true,token})

  sendToken(userLogin, 200, res);
});

exports.LogoutUser = catchAsyncError(async (req, res, next) => {
  res.cookie("token", null, { expires: new Date(Date.now()), httpOnly: true });

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});

exports.forgotPassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User Not Found"), 404);
  }

  const resetToken = await user.getResetPasswordToken();

  // saving resetPasswordToken and resetPassword expire in database

  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;

  const message = `Your password reset token is :-\n\n ${resetPasswordUrl}\n\n if you have not requested this email then, ignore it`;
  try {
    await sendEmail({
      email: user.email,

      subject: `Ecommerce password recovery`,

      message,
    });
    // console.log(message);
    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
});

//reset password

exports.resetPassword = catchAsyncError(async (req, res, next) => {
  //get token from url and create hash token and find it in database
  //as token is same so its hash also same
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler("Reset password token not found or expired", 400)
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(
      new ErrorHandler("Password and confirmPassword not matches"),
      400
    );
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  sendToken(user, 200, res);
});

exports.getUserDetails = catchAsyncError( async(req,res,next)=>{
  const user = await User.findById(req.user.id)

  res.status(200).json({
    success:true,
    user
  })
})


exports.updatePassword = catchAsyncError( async(req,res,next)=>{
  const user = await User.findById(req.user.id).select('+password')

  const isPasswordMatch = await user.comparePassword(req.body.oldPassword)

if(!isPasswordMatch){
  return next(new ErrorHandler("Old password is incorrect"),400)
}

if(req.body.newPassword!==req.body.confirmPassword){
  return next(new ErrorHandler("Password and confirmPassword does not match"),400)
}

user.password = req.body.newPassword;
await user.save()

sendToken(user,200,res)

})



//update user profile

exports.updateUserProfile = catchAsyncError( async(req,res,next)=>{
  const updateProfile = {
    name:req.body.name,
    email:req.body.email
  }

  const user = await User.findByIdAndUpdate(req.user.id,updateProfile,{runValidators:true,new:true})

  await user.save()
  res.status(200).json({success:true})
})

/////////////////////////////////////////////////////
//Get all users(admin)

exports.getAllUser= catchAsyncError(async(req,res,next)=>{

  const users = await User.find();

  res.status(200).json({
    success:true,
    users
  })

})


// Get Single user (admin)

exports.getSingleUser= catchAsyncError(async (req,res,next)=>{
  const user = await User.findById(req.params.id);

  if(!user){
    return next( new ErrorHandler(`User not exist with id: ${req.params.id}`,400))
  }

  res.status(200).json({
    success:true,
    user
  })

})


exports.updateUserRole = catchAsyncError( async(req,res,next)=>{
  
  const updateRole ={
    name:req.body.name,
    email:req.body.email,
    role:req.body.role
  }

  const user = await User.findByIdAndUpdate(req.params.id,updateRole,{new:true,runValidators:true})
  if(!user){
    return next(new ErrorHandler(`User does not exist with that id: ${req.params.id}`,400))
  }

  res.status(200).json({
    success:true,
  })
})



//Delete user ---Admin

exports.deleteUser= catchAsyncError( async(req,res,next)=>{
  const user = await User.findByIdAndRemove(req.params.id);

  if(!user){
    return next(new ErrorHandler(`User does not exist with that id: ${req.params.id}`,400))
  }

  res.status(200).json({
    success:true,
  })
})