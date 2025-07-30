import express from "express";
import {
  getUserSummary,
  getAgeDistribution,
  getEmailDomainReport,
} from "../controllers/report.controller.js";

const router = express.Router();

router.get("/summary", getUserSummary);
router.get("/age-distribution", getAgeDistribution);
router.get("/email-domains", getEmailDomainReport);

export default router;
