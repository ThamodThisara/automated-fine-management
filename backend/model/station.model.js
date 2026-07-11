import mongoose from "mongoose";

const stationShema = new mongoose.Schema(
  {
    sId: {
      type: String,
      required: true,
      unique: true,
    },

    station: {
      type: String,
      required: true,
      unique: true,
    },

    sPhoneNumber: {
      type: String,
      required: true,
      unique: true,
    },

    sEmail: {
      type: String,
      required: true,
      unique: true,
    },

    oId: {
      type: String,
      required: true,
      unique: true,
    },

    oName: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Station = mongoose.model("Station", stationShema);
export default Station;
