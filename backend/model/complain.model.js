import mongoose from "mongoose";

const complainSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    phoneNumber: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    complain: {
      type: String,
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    image: {
      type: String,
      required: true,
      default: "https://sephorainfo.com/images/complaints.png",
    },
  },
  { timestamps: true }
);

const Complain = mongoose.model("Complain", complainSchema);
export default Complain;
