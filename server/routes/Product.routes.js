import express from "express";
import {
  addProduct,
  deleteProduct,
  getDetailsById,
  getProducts,
  updateProduct,
  getProductDetailsById 
} from "../controllers/Product.controller.js";

const router = express.Router();

// All Products (Public/User/Admin)
router.get("/", getProducts);

// Create Product (Admin only – later add auth middleware)
router.post("/", addProduct);

// Get Product by ID
router.get("/:id", getDetailsById);

// Update Product by ID (Admin)
router.put("/:id", updateProduct);

// Delete Product by ID (Admin)
router.delete("/:id", deleteProduct);

router.get('/summary/:id', getProductDetailsById);

export default router;
