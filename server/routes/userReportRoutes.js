// routes/report.routes.js
import express from "express";
import {
  getUserSummary,
  getAgeDistribution,
  getEmailDomainReport,
  getUsersByMonth,
  getUsersByDay,           // ✅ NEW
  getVerifiedSplit,
  getTopAddresses,
} from "../controllers/UserReport.controller.js"; // keep this path/name consistent on disk

const router = express.Router();

// existing
router.get("/summary", getUserSummary);
router.get("/age-distribution", getAgeDistribution);
router.get("/email-domains", getEmailDomainReport);

// improved / new analytics
router.get("/by-month", getUsersByMonth);
router.get("/by-day", getUsersByDay);               // ✅ NEW endpoint
router.get("/verified-split", getVerifiedSplit);
router.get("/top-addresses", getTopAddresses);

export default router;
