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
