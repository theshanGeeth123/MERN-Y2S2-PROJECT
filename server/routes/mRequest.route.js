import express from "express";
import {
  createRequest,
  getRequests,
  getRequestsByUser,
  updateRequest,
  deleteRequest,
} from "../controllers/mRequest.controller.js";
import userAuth from "../middleware/userAuth.js";

const router = express.Router();

router.post("/", createRequest);
router.get("/", getRequests);
router.get("/my-requests", userAuth, getRequestsByUser);
router.put("/:id", updateRequest);
router.delete("/:id", deleteRequest);

export default router;
