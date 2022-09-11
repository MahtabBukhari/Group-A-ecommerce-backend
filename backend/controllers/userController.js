const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");

const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail")


exports.registerUser=catchAsyncError(async(req,res,next)=>{
    const {name,email,password}= req.body
    const createUser = await User.create({name,email,password,avatar:{
        public_id:"public_id",
        url:"urlavatar"
    }})
// const token = createUser.getJWTToken()

//     res.status(201).json({success:true,token})

sendToken(createUser,201,res)
})

exports.loginUser= catchAsyncError(async (req,res,next)=>{
    const {email,password}=req.body;
// if email or password not enters
    if(!email || ! password){
        return next(new ErrorHandler("Please Enter Email or Password",400))
    }

    const userLogin = await User.findOne({email}).select("+password")

    //if user not exist mean email not exist
    if(!userLogin){
        return next(new ErrorHandler("Invalid email or password",401))
    }

    const isPasswordMatch =await userLogin.comparePassword(password)

    //if password is not match then
    if(!isPasswordMatch){
        return next(new ErrorHandler("Invalid email or password",401))
    }

// const token  = userLogin.getJWTToken()
//     res.status(201).json({success:true,token})
 

    sendToken(userLogin,200,res)

    

})


exports.LogoutUser= catchAsyncError( async (req,res, next)=>{

    res.cookie('token',null,{ expires:new Date(Date.now()),httpOnly:true})

    res.status(200).json({
        success:true,
        message:"Logged Out"
    })
})



exports.forgotPassword = catchAsyncError( async(req,res,next)=>{
    const user = await User.findOne({email:req.body.email})

    if(!user){
        return next(new ErrorHandler("User Not Found"),404)
    }

    const resetToken = await user.getResetPasswordToken();

    // saving resetPasswordToken and resetPassword expire in database

    await user.save({validateBeforeSave:false})

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`

    const message = `Your password reset token is :-\n\n ${resetPasswordUrl}\n\n if you have not requested this email then, ignore it`
    try {

        await sendEmail({
            email:user.email,

            subject:`Ecommerce password recovery`,

            message
        })

        res.status(200).json({
            success:true,
            message: `Email sent to ${user.email} successfully`
        })

        
    } catch (error) {

        user.resetPasswordToken= undefined;
        user.resetPasswordExpire = undefined;

        await user.save({validateBeforeSave:false})

        return next( new ErrorHandler(error.message,500))


        
    }

})