import express from 'express';
import { placeOrder, getOrdersByUser,getAllOrders,updateOrderStatus,deleteOrder   } from '../controllers/Order.controller.js';
import { verifyUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/place', verifyUser, placeOrder);
router.get('/my-orders', verifyUser, getOrdersByUser);
router.get("/all", getAllOrders);
router.put("/update-status/:orderId", updateOrderStatus);
router.delete("/delete/:orderId", deleteOrder);

export default router;
