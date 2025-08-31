import { Router } from "express";
import {
  createStaff,
  getAllStaff,
  getStaffById,
  updateStaff,
  deleteStaff,staffLogin, staffLogout, getStaffByEmail
} from "../controllers/staffController.js";

const router = Router();

router.post("/", createStaff);       // Create
router.get("/", getAllStaff);        // Get all
router.get("/:id", getStaffById);    // Get one
router.put("/:id", updateStaff);     // Update
router.delete("/:id", deleteStaff);  // Delete

// POST /api/staff/auth/login
router.post("/login", staffLogin);

// POST /api/staff/auth/logout
router.post("/logout", staffLogout);

router.post("/profile-by-email", getStaffByEmail);


export default router;
