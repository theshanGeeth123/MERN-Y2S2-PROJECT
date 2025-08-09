// routes/report.routes.js
import express from "express";
import {
  getUserSummary,
  getAgeDistribution,
  getEmailDomainReport,
  getUsersByMonth,
  getVerifiedSplit,
  getTopAddresses,
} from "../controllers/userReport.controller.js";

const router = express.Router();

// existing
router.get("/summary", getUserSummary);
router.get("/age-distribution", getAgeDistribution);
router.get("/email-domains", getEmailDomainReport);

// new / improved analytics
router.get("/by-month", getUsersByMonth);
router.get("/verified-split", getVerifiedSplit);
router.get("/top-addresses", getTopAddresses);

export default router;
