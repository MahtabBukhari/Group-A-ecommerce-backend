const mongoose = require('mongoose');


const connectDatabase=()=>{

    mongoose.connect(process.env.DB_URI).then((data)=>{
        console.log(`MongoBD connected with server ${data.connection.host}`)
    })
//     .catch((err)=>{
//         console.log(err.message)   // error is resolved in server.js
//     })
}

module.exports = connectDatabase