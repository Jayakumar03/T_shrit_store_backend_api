exports.testProduct = (async (req, res, next) => {  

    res.status(200).json({
      success: true,
      greeting : "this is an dummy product"
    });
  });
