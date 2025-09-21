import express from 'express'
import userAuth from '../middleware/userAuth.js';
import { getUserById, getUserData, getUserIdByEmail,updateUser,deleteUser } from '../controllers/userController.js';
import { feedbackSubmission, getFeedbacksById, getFeedbacks, updateFeedback, deletefeedback, generateFeedbackReport, getPhotographersFromStaff} from "../controllers/feedbackController.js";
import { questionSubmission, getQuestionsAnswers, getQuestionsById, updateQuestion, updateQuestionAnswer, deleteQuestion, generateQuestionReport} from "../controllers/questionController.js";

const userRouter = express.Router();

userRouter.get('/data',userAuth,getUserData);
userRouter.get('/customer/:id',getUserById);
userRouter.get('/customer',getUserIdByEmail);
userRouter.put('/customer/:id', updateUser);
userRouter.delete('/customer/:id', deleteUser);
userRouter.post('/add-feedback',feedbackSubmission);
userRouter.get('/feedback', getFeedbacks);
userRouter.post('/feedback',feedbackSubmission);
userRouter.get('/feedback/:id', getFeedbacksById);
userRouter.put('/feedback', updateFeedback);
userRouter.delete('/feedback', deletefeedback);
userRouter.get('/feedback-report-generator', generateFeedbackReport);
userRouter.get('/feedback-photographers', getPhotographersFromStaff);

userRouter.post('/question', questionSubmission);
userRouter.get('/question', getQuestionsAnswers);
userRouter.get("/question", getQuestionsById);
userRouter.put('/question', updateQuestion);
userRouter.delete('/question', deleteQuestion);
userRouter.put('/question-answer', updateQuestionAnswer);
userRouter.get('/question-report-generator', generateQuestionReport);

export default userRouter;