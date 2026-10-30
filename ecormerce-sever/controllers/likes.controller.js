const { Likes, Products } = require("../models");

const LIKED_PRODUCT_ATTRIBUTES = [
  "id",
  "name",
  "description",
  "price",
  "stock",
  "status",
  "image",
];

async function toggleLike(req, res) {
  try {
    const { id: ProductId } = req.params;
    const UserId = req.user.id;

    const product = await Products.findByPk(ProductId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const existingLike = await Likes.findOne({
      where: { UserId, ProductId },
    });

    if (existingLike) {
      await existingLike.destroy();
      return res.status(200).json({
        success: true,
        message: "Product unliked",
        liked: false,
      });
    }

    try {
      await Likes.create({ UserId, ProductId });
    } catch (error) {
      // A double click can race the lookup above; treat it as already liked.
      if (error.name !== "SequelizeUniqueConstraintError") throw error;
    }

    return res.status(201).json({
      success: true,
      message: "Product liked",
      liked: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
}

async function getLikedProducts(req, res) {
  try {
    const UserId = req.user.id;
    const likes = await Likes.findAll({
      where: { UserId },
      include: [
        {
          model: Products,
          attributes: LIKED_PRODUCT_ATTRIBUTES,
        },
      ],
    });

    const products = likes.map((like) => like.Product).filter(Boolean);

    return res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
}

module.exports = { toggleLike, getLikedProducts };
