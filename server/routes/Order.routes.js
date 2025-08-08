import express from 'express';
import { placeOrder, getOrdersByUser,getAllOrders } from '../controllers/Order.controller.js';
import { verifyUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/place', verifyUser, placeOrder);
router.get('/my-orders', verifyUser, getOrdersByUser);
router.get("/all", getAllOrders);

export default router;
