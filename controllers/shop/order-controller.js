const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const Product = require("../../models/Product");

// ✅ CREATE ORDER (NO PAYMENT)
const createOrder = async (req, res) => {
  try {
    const {
      userId,
      cartItems,
      addressInfo,
      totalAmount,
      cartId,
    } = req.body;

    // 🟢 Reduce stock
    for (let item of cartItems) {
      let product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found`,
        });
      }

      if (product.totalStock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Not enough stock for ${product.title}`,
        });
      }

      product.totalStock -= item.quantity;
      await product.save();
    }

    // 🟢 Create order directly (COD)
    const newOrder = new Order({
      userId,
      cartId,
      cartItems,
      addressInfo,
      totalAmount,
      orderStatus: "confirmed",
      paymentMethod: "COD",
      paymentStatus: "pending",
      orderDate: new Date(),
      orderUpdateDate: new Date(),
    });

    await newOrder.save();

    // 🟢 Clear cart
    await Cart.findByIdAndDelete(cartId);

    res.status(201).json({
      success: true,
      message: "Order placed successfully (COD)",
      data: newOrder,
    });

  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

// ✅ GET USER ORDERS
const getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ userId });

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No orders found!",
      });
    }

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

// ✅ GET ORDER DETAILS
const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

module.exports = {
  createOrder,
  getAllOrdersByUser,
  getOrderDetails,
};