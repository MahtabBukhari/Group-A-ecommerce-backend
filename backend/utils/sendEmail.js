const nodeMailer = require("nodemailer");

const sendEmail= async(options) =>{

    const transporter = nodeMailer.createTransport({
        secure:false,
        requireTLS:true,
        host:process.env.SMTP_HOST,
        port:process.env.SMTP_PORT,
        service:process.env.SMTP_SERVICE,
        auth:{
            user:process.env.SMTP_USER,
            pass:process.env.SMTP_PASS
        }
    })

    const mailOptions = {
        from:process.env.SMTP_USER,
        to:options.email,
        subject:options.subject,
        message:options.message
    }


    await transporter.sendMail(mailOptions)
}


module.exports = sendEmail