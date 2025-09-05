import express from "express";
import {
  createRequest,
  getRequests,
  getRequestById,
  updateRequest,
  deleteRequest,
} from "../controllers/mRequest.controller.js";

const router = express.Router();

router.post("/", createRequest);
router.get("/", getRequests);
router.get("/:id", getRequestById);
router.put("/:id", updateRequest);
router.delete("/:id", deleteRequest);

export default router;
