
const Product = require("../models/product");
const WhereClause = require("../utils/whereClause");
const cloudinary = require("cloudinary").v2;

//& Regular user controllers
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

exports.getOneProduct = async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new Error("could not find any product form the passed id"));
  }

  res.status(200).json({
    success: true,
    product,
  });
};

exports.addReview = async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);

  const alreadyReview = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (alreadyReview) {
    product.reviews.forEach((review) => {
      if (review.user.toString() === req.user._id.toString()) {
        review.comment = comment;
        review.rating = rating;
      }
    });
  } else {
    product.reviews.push(review);
    product.numberOfReviews = product.reviews.length;
  }

  // Adjust ratings

  product.ratings =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.reviews.length;

  //save

  await product.save({ validateBeforesave: false });

  res.status(200).json({
    success: true,
  });
};

exports.deleteReview = async (req, res, next) => {
  const { productId } = req.query;

  const product = await Product.findById(productId);

  const reviews = product.reviews.filter(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  const numberOfReviews = reviews.length;

  // adjust ratings

  product.ratings =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.reviews.length;

  //update the product

  await Product.findByIdAndUpdate(
    productId,
    {
      reviews,
      ratings,
      numberOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
  });
};

exports.getOnlyReviewsForOneProduct = async (req, res, next) => {
  const product = await Product.findById(req.query.id);

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
};

//& Admin controllers

exports.adminGetAllProduct = async (req, res, next) => {
  const products = await Product.find({});

  res.status(200).json({
    success: true,
    products,
  });
};

exports.adminUpdateOneProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);

    let imageArray = [];

    if (!product) {
      return next(new Error("could not find any product form the passed id"));
    }

    if (req.files) {
      // Deleting pre-exsiting photos
      for (let index = 0; index < product.photos.length; index++) {
        console.log("deleting start...");
        await cloudinary.uploader.destroy(product.photos[index].id, {
          folder: "products",
        });
      }

      // Adding new photos

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

      req.body.photos = imageArray;

      // updating the new photos db
      product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAmdModify: false,
      });

      res.status(200).json({
        success: true,
        product,
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Files are not present in request ",
    });
  }
};

exports.adminDeleteOneProduct = async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new Error("could not find any product form the passed id"));
  }

  for (let index = 0; index < product.photos.length; index++) {
    console.log("deleting start...");
    await cloudinary.uploader.destroy(product.photos[index].id, {
      folder: "products",
    });
  }

  await product.deleteOne();

  res.status(200).json({
    success: true,
    message: "Product is removed !!",
  });
};
