const sequelize = require("../config/connection");
// const Products = require("../models/Products");
const { User } = require("../models")

async function generate_products(req, res) {
  try {
    const { name, description, price, status, stock } = req.body;

    if (!name || !description || !price || !status ||!stock === undefined) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const newProduct = {
      name,
      description,
      price,
      status,
      stock,
      date: new Date(),
      userId: req.user.id
    };

    const product = await Products.create(newProduct);

    return res.status(201).json({
      success: true,
      data: product,
      message: "Product added successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Error adding product",
      error: err.message,
    });
  }
}

async function seeAllProducts(req, res) {
  try {
    const products = await Products.findAll({
      attributes: [
        'id',
        'name',
        'description',
        'price',
        'stock',
        'status',
        'userId'
      ]
    });

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No products found",
      });
    }

    return res.status(200).json({
      success: true,
      data: products,
      message: "Products retrieved successfully",
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

async function updateproducts(req, res) {}

async function deleteProducts(req, res) {
  try {
    const { id } = req.params;
    const product = await Products.findByPk(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    await product.destroy();

    return res.status(200).json({
      success: true,
      data: product,
      message: "Product deleted successfully",
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

module.exports = { generate_products, seeAllProducts, deleteProducts };