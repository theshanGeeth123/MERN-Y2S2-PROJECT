import mongoose from "mongoose";
import Request from "../models/mRequest.model.js";
import User from "../models/userModel.js"; 
// Create a new request
export const createRequest = async (req, res) => {
  try {
    const { name, email, amount, description, account, startDate, endDate, items, paymentStatus, stripePaymentId } = req.body;

    // Ensure user is authenticated
    // const user = await User.findById(req.userId);
    // if (!user) return res.status(401).json({ success: false, message: "Unauthorized" });

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
    const { email } = req.query; // email from frontend query string
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

  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: "Invalid Request ID" });

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
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: "Invalid Request ID" });

  try {
    const deleted = await Request.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, message: "Request not found" });
    res.json({ success: true, data: deleted });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};





/*
import mongoose from "mongoose";
import Request from "../models/mRequest.model.js";
import User from "../models/userModel.js"; 

export const createRequest = async (req, res) => {
  try {
    const { amount, description, account, startDate, endDate, items } = req.body;

    const user = await User.findById(req.userId).select("name email");
    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const newRequest = new Request({
      user: req.userId,
      name: user.name || "",
      email: user.email || "",
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

export const getRequests = async (req, res) => {
  try {
    const viewrequests = await Request.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: viewrequests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const updateRequest = async (req, res) => {
  const { id } = req.params;
  const updrequst = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid Request ID" });
  }

  try {
    const updateRequest = await Request.findByIdAndUpdate(id, updrequst, {
      new: true,
    });
    if (!updateRequest) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }
    res.status(200).json({
      success: true,
      message: "Update Successful",
      data: updateRequest,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update request",
      error: error.message,
    });
  }
};

export const deleteRequest = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid Request ID" });
  }

  try {
    const delrequest = await Request.findByIdAndDelete(id);
    if (!delrequest) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }
    res.status(200).json({
      success: true,
      message: "Request deleted successfully",
      data: delrequest,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to delete request",
      error: err.message,
    });
  }
};

export const getRequestsByUser = async (req, res) => {
  try {
    const userId = req.userId;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: "Invalid user ID" });
    }

    const requests = await Request.find({ user: userId }).sort({ createdAt: -1 });

    // return success with empty array if none found
    res.json({ success: true, data: requests || [] });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch user requests",
      error: error.message,
    });
  }
};
*/


/*
import mongoose from "mongoose";
import Request from "../models/mRequest.model.js";
import userModel from "../models/userModel.js";

export const createRequest = async (req, res) => {
  try {
    const { amount, description, account, startDate, endDate, items, name, email } = req.body;

    const user = await userModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const newRequest = new Request({
      user: req.userId,
      email: email,
      amount,
      description,
      account,
      startDate,
      endDate,
      items,
    });

    await newRequest.save();

    res.status(201).json({ success: true, data: newRequest });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};


export const getRequests = async (req, res) => {
  try {
    const viewrequests = await Request.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: viewrequests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const updateRequest = async (req, res) => {
  const { id } = req.params;
  const updrequst = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid Request ID" });
  }

  try {
    const updateRequest = await Request.findByIdAndUpdate(id, updrequst, {
      new: true,
    });
    if (!updateRequest) {
      return res
        .status(404)
        .json({ success: false, message: "Request not found" });
    }
    res.status(200).json({
      success: true,
      message: "Update Successful",
      data: updateRequest,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update request",
      error: error.message,
    });
  }
};


export const deleteRequest = async (req, res) => {
  try {
    const delrequest = await Request.findByIdAndDelete(req.params.id);
    if (!delrequest) {
      return res
        .status(404)
        .json({ success: false, message: "Request not found" });
    }
    res.status(200).json({
      success: true,
      message: "Request deleted successfully",
      data: delrequest,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to delete request",
      error: err.message,
    });
  }
};


export const getRequestsByUser = async (req, res) => {
  try {
    const userId = req.userId;

    const requests = await Request.find({ user: userId }).sort({ createdAt: -1 });

    if (!requests || requests.length === 0) {
      return res.status(404).json({ success: false, message: "No requests found" });
    }

    res.json({ success: true, data: requests });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch user requests",
      error: error.message,
    });
  }
};
*/