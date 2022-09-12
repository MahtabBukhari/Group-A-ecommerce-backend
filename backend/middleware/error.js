

const ErrorHandler = require("../utils/errorHandler")


// here below (err )capture the error form stack that is throuwn to the stack by ErrorHandler.js file 
module.exports = (err,req,res,next)=>{
    err.statusCode = err.statusCode || 500,
    err.message = err.message || "internal server error"


    //handle mongo db error like invalid id
    if(err.name ==='CastError'){
        const message = `Resource Not Found ,Invalid: ${err.path}`
        err = new ErrorHandler(message,400)
    }

    //dublicate key error mean if dublicate email
    if(err.code === 11000){
        const message=`Dublicate ${Object.keys(err.keyValue)} Entered`
        err = new ErrorHandler(message,400)
    }

    //Enter wrong jwt token
    if(err.name === 'jsonwebtoken'){
        const message=`Json Web Token Invalid, Try Again`
        err = new ErrorHandler(message,400)

    }


    // expire json web token
    if(err.name === 'TokenExpiredError'){

        const message=`Json Web Token Expired, Try Again`
        err = new ErrorHandler(message,400)
    }

    res.status(err.statusCode).json({
        success:false,
        message:err.message
    })
}