import mongoose from "mongoose";

const savedCardSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true, index: true },
    type: { type: String, required: true },         
    cardNumber: { type: String, required: true },   
    expMonth: { type: Number, required: true },     
    expYear: { type: Number, required: true },     
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
