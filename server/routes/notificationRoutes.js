// routes/notificationRoutes.js
import { Router } from 'express';
import {
  createNotification,
  getNotificationById,
  listNotifications,
  updateNotification,
  deleteNotification
} from '../controllers/notificationController.js';

const router = Router();

// Create
router.post('/', createNotification);

// View
router.get('/', listNotifications);
router.get('/:id', getNotificationById);

// Edit (PUT)
router.put('/:id', updateNotification);

// Delete
router.delete('/:id', deleteNotification);

export default router;
