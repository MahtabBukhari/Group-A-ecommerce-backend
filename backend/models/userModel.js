const mongoose = require('mongoose');
const validator = require('validator')


const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"please enter your name"],
        maxLength:[30,"Name should be less then 30 charachters"],
        minLength:[4,"Name should be greater then 4 charachters"]

    },
    email:{
        type:String,
        required:[true,"Please enter your email"],
        unique:true,
        validate:[validator.isEmail,"please put valid email"]
    },
    password:{
        type:String,
        required:[true,"please write password"],
        minLength:[8,"your password must be greater then 8 charachters"],
        select:false
    },
    avatar:{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    },
    role:{
        type:String,
        default:"user"
    },

    resetPasswordToken:String,
    resetPasswordExpire:Date
})



module.exports= mongoose.model("User",userSchema);