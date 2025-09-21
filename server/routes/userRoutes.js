import express from 'express'
import userAuth from '../middleware/userAuth.js';
import { getUserById, getUserData, getUserIdByEmail,updateUser,deleteUser, getAllUsers,deleteUserByAdmin} from '../controllers/userController.js';
import { feedbackSubmission, getFeedbacksById, getFeedbacks, updateFeedback, deletefeedback, getPhotographersFromStaff} from "../controllers/feedbackController.js";
import { questionSubmission, getQuestionsAnswers, getQuestionsById, updateQuestion, updateQuestionAnswer, deleteQuestion} from "../controllers/questionController.js";


const userRouter = express.Router();

userRouter.get('/data',userAuth,getUserData);
userRouter.get('/customer/:id',userAuth,getUserById);
userRouter.get('/customer',userAuth,getUserIdByEmail);
userRouter.put('/customer/:id',userAuth,updateUser);
userRouter.delete('/customer/:id', userAuth,deleteUser);
userRouter.delete('/customerAd/:id', deleteUserByAdmin);

userRouter.get("/users", getAllUsers);


userRouter.post('/add-feedback',feedbackSubmission);
userRouter.get('/feedback', getFeedbacks);
userRouter.post('/feedback',feedbackSubmission);
userRouter.get('/feedback/:id', getFeedbacksById);
userRouter.put('/feedback', updateFeedback);
userRouter.delete('/feedback', deletefeedback);
userRouter.get('/feedback-photographers', getPhotographersFromStaff);

userRouter.post('/question', questionSubmission);
userRouter.get('/question', getQuestionsAnswers);
userRouter.get("/question", getQuestionsById);
userRouter.put('/question', updateQuestion);
userRouter.delete('/question', deleteQuestion);
userRouter.put('/question-answer', updateQuestionAnswer);


export default userRouter;