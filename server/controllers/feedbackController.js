import feedbackModel from "../models/feedbackModel.js";

export const feedbackSubmission = async (req, res) => {
  const { username, email, selectedPhotographer, rate, comment } = req.body;

  if (!username || !email || !selectedPhotographer || !rate || !comment) {
    return res.json({ success: false, message: "Please, Fill all the fields" });
  }

  try {
    const feedback = new feedbackModel({ 
      username, email,  selectedPhotographer, rate, comment
    });
    await feedback.save();
    return res.json({ success: true, data: feedback });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
export const getFeedbacks = async (req, res) => {
  try {
    const feedback = await feedbackModel.find().select("username email name selectedPhotographer rate comment").lean();

    if(!feedback){
        res.json({success:false,message:"No feedbacks yet"});
    }
    res.status(200).json({ success: true, data: feedback });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
export const getFeedbacksById = async (req, res) => {
  const { email } = req.query;
  console.log("Email received:", email);
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required', data: feedback });
  }
  try {
    const feedback = await feedbackModel.find({ email });
    if (!feedback) {
      res.json({success:false, message:"No feedbacks yet"});
    }
    return res.json({ success: true, email: email });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error', error });
  }
};

export const updateFeedback = async (req, res) => {
  const { id } = req.query;
  const { username, email, selectedPhotographer, rate, comment } = req.body;
  console.log(rate || comment);
  console.log(email || selectedPhotographer || rate || comment);
  console.log(selectedPhotographer || rate || comment);
  console.log(username || email || selectedPhotographer || rate || comment);
  console.log(username || email || selectedPhotographer || rate || comment);
  try {
    const updatedData = { username, email,  selectedPhotographer, rate, comment };
    const feedback = await feedbackModel.findByIdAndUpdate(id, updatedData, { new: true });
    if (!feedback) {
      return res.status(404).json({ success: false, message: "Feedback not found" });
    }
    res.json({ success: true,  data: feedback });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deletefeedback = async (req, res) => {
  const { id } = req.query;
  console.log(id);
  try {
    const feedback = await feedbackModel.findByIdAndDelete(id);
    if (!feedback) {
      return res.status(404).json({ success: false, message: "Feedback not found" });
    }
    res.json({ success: true, message: "Deleted feedback", data: feedback });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

