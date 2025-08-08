import Product from "../models/Products.model.js";
import mongoose from "mongoose";

// 🔹 Add a New Product (Admin Only)
export const addProduct = async (req, res) => {
  try {
    const { name, description, price, url, category, stock, availability, rating } = req.body;

    // Validation
    if (!name || !description || !price || !url) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, description, price, and image URL.",
      });
    }

    // Create and save product
    const newProduct = new Product({
      name: name.trim(),
      description,
      price,
      url,
      category: category || "general",
      stock: stock ?? 0,
      availability: availability ?? true,
      rating: rating ?? 0,
    });

    await newProduct.save();

    return res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    console.error("Add Product Error:", error.message);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// 🔹 Get All Products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error("Get Products Error:", error.message);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// 🔹 Get Product by ID
export const getDetailsById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid product ID" });
  }

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    return res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.error("Get Product By ID Error:", error.message);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// 🔹 Update Product by ID (Admin Only)
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, url, category, stock } = req.body;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name,
        description,
        price,
        url,
        category,
        stock,
        availability: stock > 0, // ✅ auto-calculate
      },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, data: updatedProduct });
  } catch (err) {
    res.status(500).json({ success: false, message: "Update failed" });
  }
};

// 🔹 Delete Product by ID (Admin Only)
export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid product ID" });
  }

  try {
    const deleted = await Product.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    return res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete Product Error:", error.message);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};
