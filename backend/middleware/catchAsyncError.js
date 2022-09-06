module.exports = controllerFunc =>(req,res,next)=>{

// handle try catch error in external file
    Promise.resolve(controllerFunc(req,res,next)).catch(next)
                                                  // it pass error to middleware error.js file
}