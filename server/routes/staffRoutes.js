import { Router } from "express";
import {
  createStaff,
  getAllStaff,
  getStaffById,
  updateStaff,
  deleteStaff,
} from "../controllers/staffController.js";

const router = Router();

router.post("/", createStaff);       // Create
router.get("/", getAllStaff);        // Get all
router.get("/:id", getStaffById);    // Get one
router.put("/:id", updateStaff);     // Update
router.delete("/:id", deleteStaff);  // Delete

export default router;
