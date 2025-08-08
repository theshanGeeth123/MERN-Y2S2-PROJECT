import Order from '../models/Order.model.js';
import Cart from '../models/Cart.model.js';
import mongoose from 'mongoose';

// Manually import and register 'user' model name to avoid populate error
import userModel from '../models/userModel.js';

mongoose.model('User', userModel.schema); //

export const placeOrder = async (req, res) => {
  try {
    const userId = req.userId;

    const cart = await Cart.findOne({ userId }).populate('items.productId');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    const total = cart.items.reduce(
      (acc, item) => acc + item.productId.price * item.quantity,
      0
    );

    const newOrder = new Order({
      userId,
      products: cart.items.map((item) => ({
        productId: item.productId._id,
        quantity: item.quantity,
      })),
      total,
    });

    await newOrder.save();
    await Cart.deleteOne({ userId });

    res.status(201).json({ success: true, order: newOrder });
  } catch (err) {
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
      .populate("userId", "name email")  // populate using registered alias
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Failed to fetch orders:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
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
