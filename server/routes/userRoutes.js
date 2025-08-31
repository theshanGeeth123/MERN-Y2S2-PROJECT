import express from 'express'
import userAuth from '../middleware/userAuth.js';
import { getUserById, getUserData, getUserIdByEmail,updateUser,deleteUser } from '../controllers/userController.js';
import { feedbackSubmission, getfeedbacks, deletefeedback} from "../controllers/feedbackController.js";

const userRouter = express.Router();

userRouter.get('/data',userAuth,getUserData);
userRouter.get('/customer/:id',getUserById);
userRouter.get('/customer',getUserIdByEmail);
userRouter.put('/customer/:id', updateUser);
userRouter.delete('/customer/:id', deleteUser);
userRouter.post('/add-feedback',feedbackSubmission);
userRouter.get('/feedback', getfeedbacks);
userRouter.post('/feedback',feedbackSubmission);
userRouter.delete('/feedback', deletefeedback);


export default userRouter;