// models/notificationModel.js
import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  body:  { type: String, required: true },

  audience: {
    type: String,
    enum: ['all', 'verified', 'unverified'],
    required: true
  },

  type: {
    type: String,
    enum: ['info', 'warning', 'account', 'promo', 'system'],
    default: 'info'
  },

  priority: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  startAt:  { type: Date, default: Date.now },
  expiresAt:{ type: Date },

  // 🔧 Now OPTIONAL (no required:true)
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

notificationSchema.index({ audience: 1, isActive: 1, startAt: 1, expiresAt: 1, type: 1 });

export default mongoose.model('Notification', notificationSchema);
