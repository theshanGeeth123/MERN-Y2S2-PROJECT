import mongoose from "mongoose";

const savedCardSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true, index: true },
    type: { type: String, required: true },         // e.g. "VISA" | "MASTERCARD"
    cardNumber: { type: String, required: true },   // stored plain (learning/demo)
    expMonth: { type: Number, required: true },     // 1..12
    expYear: { type: Number, required: true },      // e.g. 2027
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80,
    },
  },
  { timestamps: true }
);

const SavedCard = mongoose.model("SavedCard", savedCardSchema);
export default SavedCard;
