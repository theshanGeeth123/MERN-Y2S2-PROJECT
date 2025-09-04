import Request from "../models/mRequest.model.js";

// Create new request
export const createRequest = async (req, res) => {
  try {
    const request = new Request(req.body);
    await request.save();
    res.status(201).json({ success: true, request });
  } catch (error) {
    console.error("Error creating request:", error);
    res.status(500).json({ success: false, message: "Failed to create request" });
  }
};

// Get all requests
export const getRequests = async (req, res) => {
  try {
    const requests = await Request.find().sort({ createdAt: -1 });
    res.json({ success: true, requests });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch requests" });
  }
};

// Get request by ID
export const getRequestById = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ success: false, message: "Request not found" });
    res.json({ success: true, request });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch request" });
  }
};

// Update
export const updateRequest = async (req, res) => {
  try {
    const request = await Request.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!request) return res.status(404).json({ success: false, message: "Request not found" });
    res.json({ success: true, request });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update request" });
  }
};

// Delete
export const deleteRequest = async (req, res) => {
  try {
    const request = await Request.findByIdAndDelete(req.params.id);
    if (!request) return res.status(404).json({ success: false, message: "Request not found" });
    res.json({ success: true, message: "Request deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete request" });
  }
};
