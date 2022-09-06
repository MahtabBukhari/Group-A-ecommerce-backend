
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

    res.status(err.statusCode).json({
        success:false,
        message:err.message
    })
}