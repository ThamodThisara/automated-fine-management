import mongoose from "mongoose";

const stationSchema = new mongoose.Schema(
  {
    station: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const Station = mongoose.model("Station", stationSchema);
export default Station;
