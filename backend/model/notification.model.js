import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    fineId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Violation",
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
