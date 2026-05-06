const { Orders, OrderItems, Products, sequelize } = require("../models");

async function checkout(req, res) {
  const transaction = await sequelize.transaction();
  try {
    const { items, totalAmount } = req.body;
    const UserId = req.user.id;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No items in cart",
      });
    }

    // Create Order
    const order = await Orders.create(
      {
        UserId,
        totalAmount,
        status: "pending",
      },
      { transaction }
    );

    // Create OrderItems and Update Stock
    for (const item of items) {
      const product = await Products.findByPk(item.id, { transaction });
      if (!product) {
        throw new Error(`Product ${item.id} not found`);
      }
      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for product ${product.name}`);
      }

      await OrderItems.create(
        {
          OrderId: order.id,
          ProductId: item.id,
          quantity: item.quantity,
          price: product.price,
        },
        { transaction }
      );

      // Update product stock
      await product.update(
        { stock: product.stock - item.quantity },
        { transaction }
      );
    }

    await transaction.commit();

    return res.status(201).json({
      success: true,
      data: order,
      message: "Order placed successfully",
    });
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Checkout failed",
      error: error.message,
    });
  }
}

async function getMyOrders(req, res) {
  try {
    const UserId = req.user.id;
    const orders = await Orders.findAll({
      where: { UserId },
      include: [
        {
          model: OrderItems,
          include: [Products],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      data: orders,
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

module.exports = { checkout, getMyOrders };
