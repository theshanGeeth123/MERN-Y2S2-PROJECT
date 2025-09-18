import express from "express";
import {
  createRequest,
  getRequests,
  getRequestsByEmail,
  updateRequest,
  deleteRequest,
} from "../controllers/mRequest.controller.js";
import userAuth from "../middleware/userAuth.js";

const router = express.Router();

router.post("/", createRequest);
router.get("/", getRequests);
router.get("/my-requests", getRequestsByEmail);
router.put("/:id", updateRequest);
router.delete("/:id", deleteRequest);

export default router;
