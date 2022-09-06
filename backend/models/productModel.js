const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({

name:{
    type:String,
    required:[true,"please provide the name of the product"]
},

description:{
    type:String,
    required:[true,"please provide the discreption of the product"]

},

price:{
    type:Number,
    required:[true,"please provide the price of the product"],
    maxLength:[8,"price can not exceed from 8 characters"]
},

rating:{
    type:Number,
    default:0
},
stock:{
    type:Number,
    maxLength:[4,"stock can not exceed from 4 characters"],
    default:1
},

images:[{
    public_id:{
        type:String,
        required:true
    },
    url:{
        type:String,
        required:true
    }
}],

category:{
    type:String,
    required:[true,"please select a category for the product"]
},

numOfReviews:{
    type:Number,
    default:0
},

reviews:[{
    name:{
        type:String,
        required:true
    },
    rating:{
        type:Number,
        required:true
    },
    comment:{
        type:String,
        required:true
    }

}],

createdAt:{
    type:Date,
    default:Date.now
}


})

module.exports = mongoose.model("product",productSchema)