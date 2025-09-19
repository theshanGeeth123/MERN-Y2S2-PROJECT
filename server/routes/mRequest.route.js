import express from "express";
import {
  createRequest,
  getRequests,
  getRequestsByEmail,
  updateRequest,
  deleteRequest,
  reqProcess,
  getProcessedRequestsByEmail,
  getAllProcessedRequests,
} from "../controllers/mRequest.controller.js";
import userAuth from "../middleware/userAuth.js";

const router = express.Router();

router.post("/", createRequest);
router.get("/", getRequests);
router.get("/my-requests", getRequestsByEmail);
router.get("/processed-all", getAllProcessedRequests);
router.put("/:id", updateRequest);
router.delete("/:id", deleteRequest);

router.post("/:id/:action", reqProcess);
router.get("/processed", getProcessedRequestsByEmail);
export default router;
