import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    userEmail: {
      type: String,
      required: true,
    },
    packageName: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    venue: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
