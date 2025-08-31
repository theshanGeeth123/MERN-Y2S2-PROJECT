import express from "express";
import Package from "../models/packageModel.js";

import { createPackage, deletePackage, getPackages, updatePackage } from "../controllers/packageController.js";

const router = express.Router();

router.get("/", getPackages);

router.post("/", createPackage);

router.put("/:id", updatePackage);

router.delete("/:id", deletePackage);

export default router;