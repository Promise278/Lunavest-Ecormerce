const { Orders, OrderItems, Products, Users, sequelize } = require("../models");

const ORDER_STATUSES = ["pending", "paid", "shipped", "delivered", "cancelled"];

function httpError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function roundMoney(value) {
  return Math.round(value * 100) / 100;
}

async function restockOrder(orderId, transaction) {
  const items = await OrderItems.findAll({
    where: { OrderId: orderId },
    transaction,
  });

  for (const item of items) {
    const product = await Products.findByPk(item.ProductId, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });
    if (product) {
      await product.update(
        { stock: product.stock + item.quantity },
        { transaction }
      );
    }
  }
}

const orderInclude = [
  {
    model: OrderItems,
    include: [Products],
  },
];

async function checkout(req, res) {
  const { items } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      success: false,
      message: "No items in cart",
    });
  }

  // Merge duplicate cart lines and validate the shape before touching the DB.
  const quantities = new Map();
  for (const item of items) {
    const id = item && item.id;
    const quantity = Number(item && item.quantity);

    if (!id || !Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid cart item",
      });
    }

    quantities.set(id, (quantities.get(id) || 0) + quantity);
  }

  const transaction = await sequelize.transaction();

  try {
    let totalAmount = 0;
    const orderItems = [];

    for (const [productId, quantity] of quantities) {
      const product = await Products.findByPk(productId, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!product) {
        throw httpError(404, "One of the products in your cart no longer exists");
      }

      if (product.status === "inactive") {
        throw httpError(400, `${product.name} is no longer for sale`);
      }

      if (product.stock < quantity) {
        throw httpError(400, `Only ${product.stock} left of ${product.name}`);
      }

      totalAmount += product.price * quantity;
      orderItems.push({
        ProductId: product.id,
        quantity,
        price: product.price,
      });
    }

    const order = await Orders.create(
      {
        UserId: req.user.id,
        totalAmount: roundMoney(totalAmount),
        status: "pending",
      },
      { transaction }
    );

    await OrderItems.bulkCreate(
      orderItems.map((item) => ({ ...item, OrderId: order.id })),
      { transaction }
    );

    for (const [productId, quantity] of quantities) {
      const product = await Products.findByPk(productId, { transaction });
      await product.update(
        { stock: product.stock - quantity },
        { transaction }
      );
    }

    await transaction.commit();

    const createdOrder = await Orders.findByPk(order.id, {
      include: orderInclude,
    });

    return res.status(201).json({
      success: true,
      data: createdOrder,
      message: "Order placed successfully",
    });
  } catch (error) {
    await transaction.rollback();
    console.error(error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.statusCode ? error.message : "Checkout failed",
      ...(error.statusCode ? {} : { error: error.message }),
    });
  }
}

async function getMyOrders(req, res) {
  try {
    const UserId = req.user.id;
    const orders = await Orders.findAll({
      where: { UserId },
      include: orderInclude,
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

async function getOrder(req, res) {
  try {
    const order = await Orders.findByPk(req.params.id, {
      include: [
        ...orderInclude,
        {
          model: Users,
          attributes: ["id", "name", "email"],
        },
      ],
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const isOwner = order.UserId === req.user.id;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to view this order",
      });
    }

    return res.status(200).json({
      success: true,
      data: order,
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

async function cancelOrder(req, res) {
  const transaction = await sequelize.transaction();

  try {
    const order = await Orders.findByPk(req.params.id, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!order) {
      throw httpError(404, "Order not found");
    }

    if (order.UserId !== req.user.id && req.user.role !== "admin") {
      throw httpError(403, "You are not allowed to cancel this order");
    }

    if (!["pending", "paid"].includes(order.status)) {
      throw httpError(
        400,
        `Orders that are already ${order.status} cannot be cancelled`
      );
    }

    await restockOrder(order.id, transaction);
    await order.update({ status: "cancelled" }, { transaction });

    await transaction.commit();

    return res.status(200).json({
      success: true,
      data: order,
      message: "Order cancelled successfully",
    });
  } catch (error) {
    await transaction.rollback();
    console.error(error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.statusCode ? error.message : "Server error",
      ...(error.statusCode ? {} : { error: error.message }),
    });
  }
}

async function getAllOrders(req, res) {
  try {
    const where = {};
    if (req.query.status) {
      if (!ORDER_STATUSES.includes(req.query.status)) {
        return res.status(400).json({
          success: false,
          message: `Status must be one of: ${ORDER_STATUSES.join(", ")}`,
        });
      }
      where.status = req.query.status;
    }

    const orders = await Orders.findAll({
      where,
      include: [
        ...orderInclude,
        {
          model: Users,
          attributes: ["id", "name", "email"],
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

async function updateOrderStatus(req, res) {
  const { status } = req.body;

  if (!ORDER_STATUSES.includes(status)) {
    return res.status(400).json({
      success: false,
      message: `Status must be one of: ${ORDER_STATUSES.join(", ")}`,
    });
  }

  const transaction = await sequelize.transaction();

  try {
    const order = await Orders.findByPk(req.params.id, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!order) {
      throw httpError(404, "Order not found");
    }

    if (order.status === status) {
      await transaction.commit();
      return res.status(200).json({
        success: true,
        data: order,
        message: "Order status unchanged",
      });
    }

    if (order.status === "cancelled") {
      throw httpError(400, "A cancelled order cannot change status");
    }

    if (status === "cancelled") {
      await restockOrder(order.id, transaction);
    }

    await order.update({ status }, { transaction });
    await transaction.commit();

    return res.status(200).json({
      success: true,
      data: order,
      message: "Order status updated successfully",
    });
  } catch (error) {
    await transaction.rollback();
    console.error(error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.statusCode ? error.message : "Server error",
      ...(error.statusCode ? {} : { error: error.message }),
    });
  }
}

module.exports = {
  checkout,
  getMyOrders,
  getOrder,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
};
