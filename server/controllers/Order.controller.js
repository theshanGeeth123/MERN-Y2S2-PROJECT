import mongoose from 'mongoose';
import Order from '../models/Order.model.js';
import Cart from '../models/Cart.model.js';
import Product from '../models/Products.model.js';
import userModel from '../models/userModel.js';

mongoose.model('User', userModel.schema); // register for population if needed

export const placeOrder = async (req, res) => {
  try {
    const userId = req.body.userId;
    const products = req.body.products;
    const total = req.body.total;

    if (!userId || !products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ success: false, message: 'Missing required order data' });
    }

    // Validate stock
    for (const item of products) {
      const product = await Product.findById(item.productId);
      if (!product || product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Not enough stock for "${product?.name || 'Product'}"`,
        });
      }
    }

    // Update stock
    for (const item of products) {
      const product = await Product.findById(item.productId);
      product.stock -= item.quantity;
      product.availability = product.stock > 0;
      await product.save();
    }

    // Create order
    const newOrder = new Order({
      userId,
      products,
      total,
    });

    await newOrder.save();

    // Optional: Clear MongoDB cart if used
    await Cart.deleteOne({ userId });

    res.status(201).json({ success: true, order: newOrder });

  } catch (err) {
    console.error("Place order error:", err.message);
    res.status(500).json({ success: false, message: 'Order creation failed' });
  }
};

export const getOrdersByUser = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.userId }).populate('products.productId');
    res.status(200).json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch orders' });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email")
      .populate("products.productId", "name price");
    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Get all orders error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ['Processing', 'Confirmed', 'Canceled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value" });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.status(200).json({
      success: true,
      message: "Order status updated",
      order: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const deleted = await Order.findByIdAndDelete(orderId);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while deleting order",
    });
  }
};
