import mongoose from "mongoose";

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
  },

  phoneNumber: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },

  model: {
    type: String,
    required: true,
  },
});

const Vehicle = mongoose.model("Vehicle", vehicleShema);
export default Vehicle;
