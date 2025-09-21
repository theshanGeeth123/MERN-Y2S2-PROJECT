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
  getAcceptedChartData ,
} from "../controllers/mRequest.controller.js";
import userAuth from "../middleware/userAuth.js";

const router = express.Router();

router.post("/", createRequest);
router.get("/", getRequests);
router.get("/my-requests", getRequestsByEmail);
router.get("/processed", getProcessedRequestsByEmail);
router.put("/:id", updateRequest);
router.delete("/:id", deleteRequest);

router.post("/:id/:action", reqProcess);
router.get("/processed-all", getAllProcessedRequests);
router.get("/chart-accepted", getAcceptedChartData );
export default router;
