import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    account: {
      type: String,
      required: true,
      match: /^[0-9]{6,20}$/, // numbers only
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (v) {
          return v > this.startDate;
        },
        message: "End date must be after start date",
      },
    },

    items: [
      {
        _id: { type: mongoose.Schema.Types.ObjectId, ref: "RentalItem" }, // optional if you have RentalItem model
        name: { type: String, required: true },
      },
    ],

    paymentStatus: {
      type: String,
      enum: ["pending", "succeeded", "failed"],
      default: "pending",
    },

    stripePaymentId: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);
const Request = mongoose.model("request", requestSchema);
export default Request

