exports.createProduct = catchAsyncError(async (req, res, next) => {
    const createdProduct = await product.create(req.body);
    res.status(201).json({
      success: true,
      createdProduct,
    });
  })