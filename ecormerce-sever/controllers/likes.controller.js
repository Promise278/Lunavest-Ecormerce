const { Likes, Products } = require("../models");

async function toggleLike(req, res) {
  try {
    const { id: ProductId } = req.params;
    const UserId = req.user.id;

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
    } else {
      await Likes.create({ UserId, ProductId });
      return res.status(201).json({
        success: true,
        message: "Product liked",
        liked: true,
      });
    }
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
          attributes: ["id", "name", "price", "image", "description"],
        },
      ],
    });

    const products = likes.map((like) => like.Product);

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
