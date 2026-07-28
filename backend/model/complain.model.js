import mongoose from "mongoose";
import {
  PHONE_REGEX,
  EMAIL_REGEX,
  VALIDATION_MESSAGES,
} from "../utils/validators.js";

const complainSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    phoneNumber: {
      type: String,
      required: true,
      match: [PHONE_REGEX, VALIDATION_MESSAGES.phoneNumber],
    },

    email: {
      type: String,
      required: true,
      match: [EMAIL_REGEX, VALIDATION_MESSAGES.email],
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
