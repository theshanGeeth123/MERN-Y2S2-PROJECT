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
    return res.json({ success: true });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
export const getfeedbacks = async (req, res) => {
  try {
    const feedback = await feedbackModel.find().select("name selectedPhotographer rate comment").lean();

    if(!feedback){
        res.json({success:false,message:"No feedbacks yet"});
    }
    res.status(200).json({ success: true, data: feedback });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
export const deletefeedback = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const feedback = await feedbackModel.findByIdAndDelete(id);
    if (!feedback) {
      return res.status(404).json({ success: false, message: "Feedback not found" });
    }
    res.json({ success: true, message: "Deleted feedback" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

