class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query,
     this.queryStr = queryStr; // query string is portion of url after ? like  ?keyword=samosa
  }

  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword, // it gives keyword value
            $options: "i", // to make case insensitive
          },
        }
      : {};

    // keyword = name:samosa
    // console.log(keyword)
    this.query = this.query.find({ ...keyword });//like product.find({name:"productName"})
    return this;
  }

  filter() {
    // filter category by ignore others and only category left
    const queryCopy = { ...this.queryStr }; // destructure for with out refrence get quryStr

    const removeFields = ["keyword", "page", "limit"];

    removeFields.forEach((key) => delete queryCopy[key]);

    // filter on the base of price we (gt,gte,lt,lte) greater than,greater than equal to, less than ,less than equal to
    // above filter comes from font end price[gt] but it need $ sign with it so we put it as
    // first convert object to string
    let queryStr = JSON.stringify(queryCopy);
    // console.log(queryStr)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);
    // above is reqular expression
    // console.log(queryStr)
    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  pagination(contentPerPage) {
    let currentPage = Number(this.queryStr.page) || 1;

    let skip = contentPerPage * (currentPage - 1);

    this.query = this.query.limit(contentPerPage).skip(skip);
    return this;
  }
}

module.exports = ApiFeatures;
