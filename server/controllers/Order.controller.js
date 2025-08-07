import Order from '../models/Order.model.js';
import Cart from '../models/Cart.model.js';

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

