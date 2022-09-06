// here Error is a buit in class in nodejs that is used to handle error in backend




class ErrorHandler extends Error{
    constructor(message,statusCode){
        super(message)
        this.statusCode=statusCode

        // below line will through the error to the stack 
        // and from stack we get and use in middleware section 
        Error.captureStackTrace(this,this.constructor)
    }

    
}

module.exports= ErrorHandler