import mongoose from "mongoose";
import {
  NIC_REGEX,
  PHONE_REGEX,
  EMAIL_REGEX,
  VALIDATION_MESSAGES,
} from "../utils/validators.js";

const vehicleShema = new mongoose.Schema({
  no: {
    type: String,
    required: true,
    unique: true,
  },

  cNumber: {
    type: String,
    required: true,
    unique: true,
  },

  dateBrought: {
    type: Date,
    required: true,
  },

  name: {
    type: String,
    required: true,
  },

  nic: {
    type: String,
    required: true,
    uppercase: true,
    match: [NIC_REGEX, VALIDATION_MESSAGES.nic],
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

  model: {
    type: String,
    required: true,
  },
});

const Vehicle = mongoose.model("Vehicle", vehicleShema);
export default Vehicle;
