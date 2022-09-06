const app = require('./app');

const dotenv = require('dotenv');
const connectDatabase = require('./config/database')

// handle uncatch exception 
// it define at start if error accure in below it will handle it

process.on('uncaughtException',(err)=>{
    console.log(`Error: ${err.message}`)
    console.log("shutting down the server due to uncatch exception ")
    process.exit(1)

})// above handler ther error like below
// console.log(youtube)


dotenv.config({path:'backend/config/config.env'})

connectDatabase();


const server= app.listen(process.env.PORT,()=>{
    console.log(`server is running on http://localhost:${process.env.PORT}`)
})


// always in last section define it
// unhandled promise rejection (this error like database unvalid connection string etc )
// to handle database connection error
process.on('unhandledRejection',(err)=>{
    console.log(`Error: ${err.message}`)
    console.log("shutting down the server due to unhandled promise rejection")

    server.close(()=>{
        process.exit(1)
    })

})
