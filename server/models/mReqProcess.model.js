import mongoose from "mongoose";

const processedRequestSchema = new mongoose.Schema({
  email: { type: String, required: true },
  items: [{ name: String, qty: Number }],
  amount: { type: Number, required: true },
  status: { type: String, required: true },
  startDate: Date,
  endDate: Date,
  processedAt: { type: Date, default: Date.now },
});

export default mongoose.model("ProcessedRequest", processedRequestSchema);
