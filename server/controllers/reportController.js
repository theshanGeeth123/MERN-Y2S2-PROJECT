// controllers/reportController.js

import Order from "../models/Order.model.js";
import Product from "../models/Products.model.js";
import mongoose from "mongoose";

// 📈 Total sales per month
export const getSalesReport = async (req, res) => {
  try {
    const sales = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          totalSales: { $sum: "$total" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({ success: true, data: sales });
  } catch (err) {
    res.status(500).json({ success: false, message: "Sales report failed" });
  }
};

// 🛒 Top 5 best-selling products
export const getTopProducts = async (req, res) => {
  try {
    const topProducts = await Order.aggregate([
      { $unwind: "$products" },
      {
        $group: {
          _id: "$products.productId",
          totalSold: { $sum: "$products.quantity" },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $project: {
          name: "$product.name",
          totalSold: 1,
        },
      },
    ]);

    res.json({ success: true, data: topProducts });
  } catch (err) {
    res.status(500).json({ success: false, message: "Top products report failed" });
  }
};

// 📦 Orders by status
export const getOrderStatusReport = async (req, res) => {
  try {
    const statusReport = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({ success: true, data: statusReport });
  } catch (err) {
    res.status(500).json({ success: false, message: "Status report failed" });
  }
};

// 📂 Revenue by category
export const getRevenueByCategory = async (req, res) => {
  try {
    const revenue = await Order.aggregate([
      { $unwind: "$products" },
      {
        $lookup: {
          from: "products",
          localField: "products.productId",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },
      {
        $group: {
          _id: "$productDetails.category",
          revenue: {
            $sum: {
              $multiply: ["$products.quantity", "$productDetails.price"],
            },
          },
        },
      },
    ]);

    res.json({ success: true, data: revenue });
  } catch (err) {
    res.status(500).json({ success: false, message: "Category revenue report failed" });
  }
};
