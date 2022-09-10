const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("./catchAsyncError");
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')


exports.isAuthenticatedUser = catchAsyncError( async (req, res, next) => {

    const {token} = req.cookies;

    if(!token){
        return next(new ErrorHandler('please first login to get resource',401))
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    req.user= await User.findById(decodedToken.id)
next()


    
})