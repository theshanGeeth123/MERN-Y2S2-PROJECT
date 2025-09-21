import feedbackModel from "../models/feedbackModel.js";
import staffModel from "../models/staffModel.js";
import PDFDocument from 'pdfkit';

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
    const feedback = await feedbackModel.find().select("username email name selectedPhotographer rate comment createdAt").lean();

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

export const generateFeedbackReport = async (req, res) => {
  try {
    const feedbacks = await feedbackModel.find();
    const doc = new PDFDocument();

    res.setHeader('Content-Disposition', 'attachment; filename=feedback_report.pdf');
    res.setHeader('Content-Type', 'application/pdf');
    doc.pipe(res); //pipe pdf to the response
    doc.fontSize(20).text('Feedback Report', { align: 'center' });
    doc.moveDown();

    feedbacks.forEach((fb, i) => {
      doc.fontSize(12) .text( `${i + 1}. Username: ${fb.username} | Comment: ${fb.comment} | Rating: ${fb.rate} | Created On: ${new Date(fb.createdAt).toISOString().split('T')[0]}` );
      doc.moveDown(1.2);
    });
    doc.end();
  } catch (err) {
    res.status(500).json({ message: 'Error generating report', error: err.message });
  }
};

export const getPhotographersFromStaff = async (req, res) => {
  const role = "photographer";
  try {
    const photographerStaff = await staffModel.find({ role });
    if (!photographerStaff) {
      res.json({success:false, message:"No photographers found"});
    }
    return res.json({ success: true, phographers: photographerStaff });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error', error });
  }
};