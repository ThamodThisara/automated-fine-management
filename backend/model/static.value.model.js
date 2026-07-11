import mongoose from "mongoose";

const StaticValueSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
});

const StaticValue = mongoose.model("staticvalue", StaticValueSchema);

export default StaticValue;
