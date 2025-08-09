// routes/report.routes.js
import express from "express";

// User analytics controllers
import {
  getUserSummary,
  getAgeDistribution,
  getEmailDomainReport,
  getUsersByMonth,
  getVerifiedSplit,
  getTopAddresses,
} from "../controllers/report.controller.js";

// Sales/Orders analytics controllers
import {
  getSalesReport,
  getTopProducts,
  getOrderStatusReport,
  getRevenueByCategory,
} from "../controllers/reportController.js";

const router = express.Router();

// --- User analytics ---
router.get("/summary", getUserSummary);
router.get("/age-distribution", getAgeDistribution);
router.get("/email-domains", getEmailDomainReport);
router.get("/by-month", getUsersByMonth);
router.get("/verified-split", getVerifiedSplit);
router.get("/top-addresses", getTopAddresses);

// --- Sales/Orders analytics ---
router.get("/sales", getSalesReport);
router.get("/top-products", getTopProducts);
router.get("/status", getOrderStatusReport);
router.get("/category", getRevenueByCategory);

export default router;
