const Product = require("../models/product");
const WhereClause = require("../utils/whereClause");
const cloudinary = require("cloudinary").v2;

exports.addProduct = async (req, res, next) => {
  // images

  let imageArray = [];

  if (!req.files) {
    return next(new CustomError("images are required", 401));
  }
  console.log("RESULT", req.files.photos[0], "at line number 13");

  if (req.files) {
    for (let index = 0; index < req.files.photos.length; index++) {
      console.log("UPLOAD START...");
      let result = await cloudinary.uploader.upload(
        req.files.photos[index].tempFilePath,
        {
          folder: "products",
        }
      );

      console.log("RESULT", result);
      imageArray.push({
        id: result.public_id,
        secure_url: result.secure_url,
      });
    }
  }

  req.body.photos = imageArray;
  req.body.user = req.user.id;

  const product = await Product.create(req.body);

  res.status(200).json({
    success: true,
    product,
  });
};

exports.getAllProduct = async (req, res, next) => {
  try {
    const resultPerPage = 6;
    const totalCountProduct = await Product.countDocuments();

    const productsObj = new WhereClause(Product.find(), req.query)
      .search()
      .filter();

    let products = await productsObj.base;
    const filteredProductNumber = products.length;

    productsObj.pager(resultPerPage);

    products = await productsObj.base.clone();

    res.status(200).json({
      sucess: true,
      products,
      filteredProductNumber,
      totalCountProduct,
    });
  } catch (error) {
    console.log(error);
  }
};
