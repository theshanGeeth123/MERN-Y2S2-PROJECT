import mongoose from "mongoose";
import Request from "../models/mRequest.model.js";
import ProcessedRequest from "../models/mReqProcess.model.js";

// Create a new request
export const createRequest = async (req, res) => {
  try {
    const { name, email, amount, description, account, startDate, endDate, items, paymentStatus, stripePaymentId } = req.body;

    const newRequest = new Request({
      name,
      email,
      amount,
      description,
      account,
      startDate,
      endDate,
      items,
      paymentStatus: paymentStatus || "pending",
      stripePaymentId: stripePaymentId || null,
    });

    await newRequest.save();
    res.status(201).json({ success: true, data: newRequest });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get all requests
export const getRequests = async (req, res) => {
  try {
    const requests = await Request.find().sort({ createdAt: -1 });
    res.json({ success: true, data: requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get requests by user
export const getRequestsByEmail = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const requests = await Request.find({ email }).sort({ createdAt: -1 });
    res.json({ success: true, data: requests || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a request
export const updateRequest = async (req, res) => {
  const { id } = req.params;
  const updRequest = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid Request ID" });
  }

  try {
    const updated = await Request.findByIdAndUpdate(id, updRequest, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: "Request not found" });
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a request
export const deleteRequest = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid Request ID" });
  }

  try {
    const deleted = await Request.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, message: "Request not found" });
    res.json({ success: true, data: deleted });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Accept or Reject a request
/*
export const reqProcess = async (req, res) => {
  const { id, action } = req.params; // action = "accept" or "reject"

  if (!["accept", "reject"].includes(action)) {
    return res.status(400).json({ success: false, message: "Invalid action" });
  }

  try {
    const request = await Request.findById(id);
    if (!request) return res.status(404).json({ success: false, message: "Request not found" });

    // Save to ProcessedRequest
    const processed = new ProcessedRequest({
      email: request.email,
      items: request.items,
      amount: request.amount,
      status: action,
      startDate: request.startDate,
      endDate: request.endDate,
    });
    await processed.save();

    // ✅ Update original request status (optional but recommended)
    request.status = action;
    await request.save();

    res.json({ success: true, message: `Request ${action}ed successfully`, data: processed });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
*/


export const reqProcess = async (req, res) => {
  const { id, action } = req.params;

  if (!["accept", "reject"].includes(action)) {
    return res.status(400).json({ success: false, message: "Invalid action" });
  }

  try {
    const request = await Request.findById(id);
    if (!request) return res.status(404).json({ success: false, message: "Request not found" });

    // Save to ProcessedRequest
    const processed = new ProcessedRequest({
      email: request.email,
      items: request.items,
      amount: request.amount,
      status: action,
      startDate: request.startDate,
      endDate: request.endDate,
    });
    await processed.save();

    // Delete from Request collection so it won't appear again
    await Request.findByIdAndDelete(id);

    res.json({ success: true, message: `Request ${action}ed successfully`, data: processed });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// --- Get processed requests by user ---
export const getProcessedRequestsByEmail = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ success: false, message: "Email is required" });

    // Case-insensitive & trimmed query to avoid mismatches
    const processed = await ProcessedRequest.find({
      email: { $regex: `^${email.trim()}$`, $options: "i" }
    }).sort({ processedAt: -1 });

    res.json({ success: true, data: processed || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getAllProcessedRequests = async (req, res) => {
  try {
    const processed = await ProcessedRequest.find().sort({ processedAt: -1 });
    res.json({ success: true, data: processed });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
