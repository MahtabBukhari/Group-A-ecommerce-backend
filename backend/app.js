const express = require('express');
const product = require('./routes/productRoute')
const user = require('./routes/userRoute')
const order = require('./routes/orderRoute')
const errorMiddleware = require('./middleware/error')
const cookieParser = require('cookie-parser')

const app = express()

app.use(express.json())
// for useing cookie use it must
app.use(cookieParser());

// api routes

app.use('/api/v1', product)
app.use('/api/v1',user)
app.use('/api/v1',order)




// middleware for error
app.use(errorMiddleware)




module.exports=app