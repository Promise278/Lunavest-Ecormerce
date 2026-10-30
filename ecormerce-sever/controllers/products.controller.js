const { Op } = require("sequelize");
const { Products, Users } = require("../models");

const VALID_STATUS = ["available", "inactive", "out-of-stock"];

const DEFAULT_LIMIT = 12;
const MAX_LIMIT = 48;

const PRODUCT_ATTRIBUTES = [
  "id",
  "name",
  "description",
  "price",
  "stock",
  "status",
  "category",
  "image",
  "UserId",
  "createdAt",
  "updatedAt",
];

function toNumber(value) {
  if (value === "" || value === null || value === undefined) return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

async function generate_products(req, res) {
  try {
    const { name, description, price, stock } = req.body;
    const status = req.body.status || "available";
    const category = (req.body.category || "Other").trim() || "Other";

    if (!name || !description || price === undefined || stock === undefined) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const numericPrice = toNumber(price);
    if (numericPrice === null || numericPrice < 0) {
      return res.status(400).json({
        success: false,
        message: "Price must be a valid number",
      });
    }

    const numericStock = toNumber(stock);
    if (numericStock === null || !Number.isInteger(numericStock) || numericStock < 0) {
      return res.status(400).json({
        success: false,
        message: "Stock must be a whole number",
      });
    }

    if (!VALID_STATUS.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${VALID_STATUS.join(", ")}`,
      });
    }

    if (!req.file || !req.file.path) {
      return res.status(400).json({
        success: false,
        message: "Product image is required",
      });
    }

    const product = await Products.create({
      name: name.trim(),
      description,
      price: numericPrice,
      status,
      category,
      stock: numericStock,
      image: req.file.path,
      UserId: req.user.id,
    });

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
    const search = String(req.query.search || "").trim();
    const category = String(req.query.category || "").trim();

    const where = {};

    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
      ];
    }

    if (category && category !== "All Category") {
      where.category = category;
    }

    const page = Math.max(parseInt(String(req.query.page || "1"), 10) || 1, 1);
    const requestedLimit = parseInt(String(req.query.limit || ""), 10);
    const limit =
      Number.isFinite(requestedLimit) && requestedLimit > 0
        ? Math.min(requestedLimit, MAX_LIMIT)
        : DEFAULT_LIMIT;
    const offset = (page - 1) * limit;

    const { count, rows } = await Products.findAndCountAll({
      where,
      attributes: PRODUCT_ATTRIBUTES,
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    return res.status(200).json({
      success: true,
      data: rows,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.max(Math.ceil(count / limit), 1),
        hasMore: offset + rows.length < count,
      },
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

async function getProduct(req, res) {
  try {
    const { id } = req.params;

    const product = await Products.findByPk(id, {
      attributes: PRODUCT_ATTRIBUTES,
      include: [
        {
          model: Users,
          as: "User",
          attributes: ["id", "name"],
        },
      ],
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: product,
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

async function updateproducts(req, res) {
  try {
    const { id } = req.params;
    const product = await Products.findByPk(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const updates = {};

    if (req.body.name !== undefined) {
      if (!req.body.name.trim()) {
        return res.status(400).json({
          success: false,
          message: "Product name cannot be empty",
        });
      }
      updates.name = req.body.name.trim();
    }

    if (req.body.description !== undefined) {
      updates.description = req.body.description;
    }

    if (req.body.price !== undefined) {
      const price = toNumber(req.body.price);
      if (price === null || price < 0) {
        return res.status(400).json({
          success: false,
          message: "Price must be a valid number",
        });
      }
      updates.price = price;
    }

    if (req.body.stock !== undefined) {
      const stock = toNumber(req.body.stock);
      if (stock === null || !Number.isInteger(stock) || stock < 0) {
        return res.status(400).json({
          success: false,
          message: "Stock must be a whole number",
        });
      }
      updates.stock = stock;
    }

    if (req.body.status !== undefined) {
      if (!VALID_STATUS.includes(req.body.status)) {
        return res.status(400).json({
          success: false,
          message: `Status must be one of: ${VALID_STATUS.join(", ")}`,
        });
      }
      updates.status = req.body.status;
    }

    if (req.body.category !== undefined) {
      const category = String(req.body.category).trim();
      if (!category) {
        return res.status(400).json({
          success: false,
          message: "Category cannot be empty",
        });
      }
      updates.category = category;
    }

    if (req.file && req.file.path) {
      updates.image = req.file.path;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Nothing to update",
      });
    }

    await product.update(updates);

    return res.status(200).json({
      success: true,
      data: product,
      message: "Product updated successfully",
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
    if (error.name === "SequelizeForeignKeyConstraintError") {
      return res.status(409).json({
        success: false,
        message: "This product is part of an existing order and cannot be deleted",
      });
    }
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
}

module.exports = {
  generate_products,
  seeAllProducts,
  getProduct,
  updateproducts,
  deleteProducts,
};
