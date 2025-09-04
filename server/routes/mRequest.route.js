import express from "express";
import {
  createRequest,
  getRequests,
  getRequestById,
  updateRequest,
  deleteRequest,
} from "../controllers/mRequest.controller.js";

const router = express.Router();

// create
router.post("/", createRequest);

// all requests
router.get("/", getRequests);

// single request by id
router.get("/:id", getRequestById);

// update
router.put("/:id", updateRequest);

// remove
router.delete("/:id", deleteRequest);

export default router;
