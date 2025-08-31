import express from 'express'
import userAuth from '../middleware/userAuth.js';
import { getUserById, getUserData, getUserIdByEmail,updateUser,deleteUser, getAllUsers,deleteUserByAdmin} from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.get('/data',userAuth,getUserData);
userRouter.get('/customer/:id',userAuth,getUserById);
userRouter.get('/customer',userAuth,getUserIdByEmail);
userRouter.put('/customer/:id',userAuth,updateUser);
userRouter.delete('/customer/:id', userAuth,deleteUser);
userRouter.delete('/customerAd/:id', deleteUserByAdmin);

userRouter.get("/users", getAllUsers);


export default userRouter;