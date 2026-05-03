const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  cartId: {
    type: String,
    required: true,
  },
  cartItems: [
    {
      productId: String,
      title: String,
      image: String,
      price: {
        type: Number, // ✅ FIXED
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  addressInfo: {
    addressId: String,
    address: String,
    city: String,
    pincode: String,
    phone: String,
    notes: String,
  },
  orderStatus: {
    type: String,
    default: "confirmed", // ✅ better default
  },
  paymentMethod: {
    type: String,
    default: "COD", // ✅ since no online payment
  },
  paymentStatus: {
    type: String,
    default: "pending",
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
  orderUpdateDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Order", OrderSchema);