import questionModel from "../models/questionModel.js";

export const questionSubmission = async (req, res) => {
  const { username, email, question, status, answer } = req.body;

  if (!username || !email || !question) {
    return res.json({ success: false, message: "Please, Fill all the fields" });
  }

  try {
    const askedQuestion = new questionModel({  username, email, question, status, answer });
    await askedQuestion.save();
    return res.json({ success: true, data: askedQuestion });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getQuestionsAnswers = async (req, res) => {
  try {
    const qa = await questionModel.find().select("username email question status answer createdAt updatedAt").lean();

    if(!qa){
        res.json({success:false, message:"No questions yet"});
    }
    res.status(200).json({ success: true, data: qa });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getQuestionsById = async (req, res) => {
  const { email } = req.query;
  console.log("Email received:", email);
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required', data: question });
  }
  try {
    const questions = await questionModel.find({ email });
    if (!questions) {
      res.json({success:false, message:"No questions yet"});
    }
    return res.json({ success: true, data: questions });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error', error });
  }
};

export const updateQuestion = async (req, res) => {
  const { id } = req.query; // refer id of the question that needs to be updated
  const { username, email, question, status } = req.body;
  console.log(status);
  try {
    const updatedData = { username, email,  question, status};
    const askedQuestion = await questionModel.findByIdAndUpdate(id, updatedData, { new: true });
    if (!askedQuestion) {
      return res.status(404).json({ success: false, message: "question not found" });
    }
    res.json({ success: true,  data: askedQuestion });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateQuestionAnswer = async (req, res) => {
  const { id } = req.query; // refer id of the question that needs to be updated
  const { username, email, answer, status} = req.body;
  try {
    const updatedData = { username, email,  answer, status};
    const questionAns = await questionModel.findByIdAndUpdate(id, updatedData, { new: true });
    if (!questionAns) {
      return res.status(404).json({ success: false, message: "No question found" });
    }
    res.json({ success: true,  data: updatedData });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteQuestion = async (req, res) => {
  const { id } = req.query;
  console.log(id);
  try {
    const question = await questionModel.findByIdAndDelete(id);
    if (!question) {
      return res.status(404).json({ success: false, message: "Question not found" });
    }
    res.json({ success: true, message: "Deleted question", data: question });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

