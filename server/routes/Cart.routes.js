// routes/Cart.routes.js

import express from "express";
import {
  addToCart,
  getCartByUser,
  updateCartItem,
  removeCartItem,
  clearCart
} from "../controllers/Cart.controller.js";

const router = express.Router();

// Add product to cart
router.post("/add", addToCart);

// Get cart by userId
router.get("/:userId", getCartByUser);

// Update quantity of a cart item
router.put("/update/:productId", updateCartItem);

// Remove item from cart
router.delete("/remove/:productId", removeCartItem);

// Clear entire cart
router.delete("/clear", clearCart);

export default router;
