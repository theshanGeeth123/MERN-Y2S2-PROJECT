// routes/reportRoutes.js

import express from "express";
import {
  getSalesReport,
  getTopProducts,
  getOrderStatusReport,
  getRevenueByCategory,
} from "../controllers/reportController.js";

const router = express.Router();

router.get("/sales", getSalesReport);
router.get("/top-products", getTopProducts);
router.get("/status", getOrderStatusReport);
router.get("/category", getRevenueByCategory);

export default router;
