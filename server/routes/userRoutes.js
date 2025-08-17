import express from 'express'
import userAuth from '../middleware/userAuth.js';
import { getUserById, getUserData, getUserIdByEmail,updateUser,deleteUser } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.get('/data',userAuth,getUserData);
userRouter.get('/customer/:id',userAuth,getUserById);
userRouter.get('/customer',userAuth,getUserIdByEmail);
userRouter.put('/customer/:id',userAuth,updateUser);
userRouter.delete('/customer/:id', userAuth,deleteUser);


export default userRouter;