import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    station: {
      type: String,
      required: true,
    },

    message: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
        default: [],
      },
    ],
  },
  { timestamps: true }
);

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;
