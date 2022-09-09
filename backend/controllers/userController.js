const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");


exports.registerUser=catchAsyncError(async(req,res,next)=>{
    const {name,email,password}= req.body
    const createUser = await User.create({name,email,password,avatar:{
        public_id:"public_id",
        url:"urlavatar"
    }})
const token = createUser.getJWTToken()

    res.status(201).json({success:true,token})
})