import mongoose from "mongoose";
import {
  NIC_REGEX,
  PHONE_REGEX,
  EMAIL_REGEX,
  VALIDATION_MESSAGES,
} from "../utils/validators.js";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    nic: {
      type: String,
      required: true,
      uppercase: true,
      match: [NIC_REGEX, VALIDATION_MESSAGES.nic],
    },

    dob: {
      type: Date,
      required: true,
    },

    address: {
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
      unique: true,
      match: [EMAIL_REGEX, VALIDATION_MESSAGES.email],
    },

    // Only officers carry a human-readable id (their official police/badge number).
    // Drivers and admins are identified by their MongoDB _id, so id is optional for them.
    // sparse keeps the unique index but ignores documents that have no id at all.
    id: {
      type: String,
      required: function () {
        return this.role === "officer";
      },
      unique: true,
      sparse: true,
    },

    profilePicture: {
      type: String,
      // Local default avatar (served from the frontend's public/ folder) so it works offline.
      default: "/default-avatar.jpg",
    },

    role: {
      type: String,
      enum: ["officer", "driver", "admin"],
      required: true,
      default: "officer",
    },

    vType: {
      type: String,
      required: function () {
        return this.role === "driver";
      },
    },

    model: {
      type: String,
      required: function () {
        return this.role === "driver";
      },
    },

    pStation: {
      type: String,
      required: function () {
        return this.role === "officer";
      },
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
