// controllers/notificationController.js
import mongoose from 'mongoose';
import Notification from '../models/notificationModel.js';

// CREATE
export const createNotification = async (req, res) => {
  try {
    const {
      title,
      body,
      audience,   // 'all' | 'verified' | 'unverified'
      type,       // optional: 'info' | 'warning' | 'account' | 'promo' | 'system'
      priority,   // optional number
      isActive,   // optional boolean
      startAt,    // optional date
      expiresAt,  // optional date
      createdBy   // optional (you chose not to use req.userId)
    } = req.body;

    if (expiresAt && startAt && new Date(expiresAt) <= new Date(startAt)) {
      return res.status(400).json({ success: false, message: 'expiresAt must be after startAt' });
    }

    const doc = await Notification.create({
      title, body, audience, type, priority, isActive, startAt, expiresAt, createdBy
    });

    return res.status(201).json({ success: true, data: doc });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

// VIEW: single by ID
export const getNotificationById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid notification id' });
    }

    const doc = await Notification.findById(id);
    if (!doc) return res.status(404).json({ success: false, message: 'Notification not found' });

    return res.json({ success: true, data: doc });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// VIEW: list all (no filters)
export const listNotifications = async (_req, res) => {
  try {
    const items = await Notification.find({}).sort({ priority: -1, createdAt: -1 });
    return res.json({ success: true, data: items });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// EDIT (PUT)
export const updateNotification = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid notification id' });
    }

    // Allow updating only these fields
    const allowed = ['title', 'body', 'audience', 'type', 'priority', 'isActive', 'startAt', 'expiresAt'];
    const updates = {};
    for (const key of allowed) {
      if (key in req.body) updates[key] = req.body[key];
    }

    if ('expiresAt' in updates && 'startAt' in updates) {
      if (updates.expiresAt && updates.startAt && new Date(updates.expiresAt) <= new Date(updates.startAt)) {
        return res.status(400).json({ success: false, message: 'expiresAt must be after startAt' });
      }
    }

    const doc = await Notification.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true, // keep enum/required checks
      // overwrite: true // <- leave OFF so PUT behaves as partial update per your preference
    });

    if (!doc) return res.status(404).json({ success: false, message: 'Notification not found' });
    return res.json({ success: true, data: doc });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE
export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid notification id' });
    }

    const doc = await Notification.findByIdAndDelete(id);
    if (!doc) return res.status(404).json({ success: false, message: 'Notification not found' });

    return res.json({ success: true, message: 'Notification deleted' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
