import express from "express";
import { createBooking, getBookings, getUserBookings, updateBookingStatus, deleteBooking, getBookingTrends,getBookingTrendsChart } from "../controllers/bookingController.js";

const router = express.Router();

router.post("/", createBooking);
router.get("/", getBookings);
router.get("/trends", getBookingTrends);
router.get("/user/:email", getUserBookings); 
router.put("/:id/status", updateBookingStatus);
router.delete("/:id", deleteBooking);

//for chart
router.get("/trends", getBookingTrendsChart);

export default router;
