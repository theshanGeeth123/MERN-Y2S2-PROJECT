import mongoose from "mongoose";
import Request from "../models/mRequest.model.js";

export const createRequest = async (req, res) => {
  try {
    const newRequest = new Request(req.body);
    await newRequest.save();
    res.status(201).json({
      success: true,
      data: newRequest,
    });
  } catch (error) {
    console.error("Error in Create Request:", error.message);
    res.status(400).json({
      error: true,
      message: error.message, 
    });
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

export const getRequestById = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) {
      return res
        .status(404)
        .json({ success: false, message: "Request not found" });
    }
    res.json({ success: true, data: request }); // ✅ consistent key: data
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch request",
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


// export const deleteRequest = async (req, res) => {
//   const { id } = req.params;
//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     return res.status(400).json({ success: false, message: "Invalid Request ID" });
//   }

//   try {
//     const result = await Request.deleteOne({ _id: id });

//     if (result.deletedCount === 0) {
//       return res.status(404).json({ success: false, message: "Request not found" });
//     }
//     return res.status(200).json({
//       success: true,
//       message: "Request deleted successfully",
//       meta: { deletedCount: result.deletedCount, id }
//     });
//   } catch (err) {
//     console.error("Delete error:", err);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to delete request",
//       error: err.message
//     });
//   }
// };