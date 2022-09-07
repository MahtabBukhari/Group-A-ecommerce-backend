class ApiFeatures{
    constructor(query,queryStr){
        this.query=query,
        this.queryStr=queryStr      // query string is portion of url after ? like  ?keyword=samosa
    }

    search(){
        const keyword = this.queryStr.keyword?
    {name:{
        $regex:this.queryStr.keyword, // it gives keyword value
        $options:'i'                  // to make case insensitive
    }}:{

    }

    // keyword = name:samosa
    // console.log(keyword)
    this.query=this.query.find({...keyword})
    return this
    }

    filter(){// filter category by ignore others and only category left
        const queryStrCopy = {...this.queryStr}
console.log(queryStrCopy)
       const removeFields = ["keyword","page","limit"]

        removeFields.forEach(key => delete queryStrCopy[key]);
console.log(queryStrCopy)
        this.query=this.query.find(queryStrCopy)
       
        return this
    }
}

module.exports = ApiFeatures