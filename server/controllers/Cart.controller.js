import Cart from "../models/Cart.model.js";
import Product from "../models/Products.model.js"; // ✅ Required for stock check

// 🔹 Add to cart (create or update)
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user?.id || req.body.userId;

    if (!productId || !quantity) {
      return res.status(400).json({ success: false, message: "Product ID and quantity required." });
    }

    // ✅ 1. Fetch product and validate stock
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }

    if (!product.availability || product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: "Not enough stock available or product is unavailable.",
      });
    }

    // ✅ 2. Fetch or create cart
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        items: [{ productId, quantity }],
      });
    } else {
      const itemIndex = cart.items.findIndex(item => item.productId.equals(productId));

      if (itemIndex > -1) {
        // Existing item: calculate total requested quantity
        const totalQty = cart.items[itemIndex].quantity + quantity;
        if (totalQty > product.stock) {
          return res.status(400).json({
            success: false,
            message: "Total quantity exceeds stock availability.",
          });
        }

        cart.items[itemIndex].quantity = totalQty;
      } else {
        // New item: validate quantity again
        if (quantity > product.stock) {
          return res.status(400).json({
            success: false,
            message: "Requested quantity exceeds stock availability.",
          });
        }

        cart.items.push({ productId, quantity });
      }
    }

    await cart.save();
    res.status(200).json({ success: true, cart });

  } catch (error) {
    console.error("Add to cart error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// 🔹 Get cart by user ID
export const getCartByUser = async (req, res) => {
  try {
    const userId = req.user?.id || req.params.userId;

    const cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart) {
      return res.status(200).json({ success: true, cart: { items: [] } });
    }

    res.status(200).json({ success: true, cart });

  } catch (error) {
    console.error("Get cart error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 🔹 Update item quantity in cart
export const updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    const userId = req.user?.id || req.body.userId;

    const cart = await Cart.findOne({ userId });

    if (!cart) return res.status(404).json({ success: false, message: "Cart not found." });

    const item = cart.items.find(item => item.productId.equals(productId));
    if (!item) return res.status(404).json({ success: false, message: "Item not in cart." });

    item.quantity = quantity;
    await cart.save();

    res.status(200).json({ success: true, cart });

  } catch (error) {
    console.error("Update cart item error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 🔹 Remove item from cart
export const removeCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user?.id || req.body.userId;

    const cart = await Cart.findOneAndUpdate(
      { userId },
      { $pull: { items: { productId } } },
      { new: true }
    );

    if (!cart) return res.status(404).json({ success: false, message: "Cart not found." });

    res.status(200).json({ success: true, cart });

  } catch (error) {
    console.error("Remove cart item error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 🔹 Clear entire cart
export const clearCart = async (req, res) => {
  try {
    const userId = req.user?.id || req.body.userId;

    const cart = await Cart.findOneAndUpdate(
      { userId },
      { $set: { items: [] } },
      { new: true }
    );

    if (!cart) return res.status(404).json({ success: false, message: "Cart not found." });

    res.status(200).json({ success: true, cart });

  } catch (error) {
    console.error("Clear cart error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


