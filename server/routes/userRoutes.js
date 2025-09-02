import express from 'express'
import userAuth from '../middleware/userAuth.js';
import { getUserById, getUserData, getUserIdByEmail,updateUser,deleteUser } from '../controllers/userController.js';
import { feedbackSubmission, getFeedbacksById, getFeedbacks, updateFeedback, deletefeedback} from "../controllers/feedbackController.js";

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


export default userRouter;