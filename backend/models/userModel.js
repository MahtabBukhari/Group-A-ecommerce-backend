const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')




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

userSchema.pre("save", async function(next){
    //if user update the profile user will change only name email avatar not password because we set separate option to change password
    // if user change only profile without changing the password the already existing password bcrypt again that is issue so resolve it as
    
    if(!this.isModified('password')){  // mean if password not change it moves to next not encrypt password again
        next()
     }
    this.password =await bcrypt.hash(this.password,10) // bcrypt.hash(password, salt)
})
// when user signup then user must login automatechly mean user has not to sign in for this we generate token using (id) of the user

userSchema.methods.getJWTToken = function(){

   return jwt.sign({id:this._id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRE})


}


module.exports= mongoose.model("User",userSchema);