import mongoose from "mongoose";

const violationShema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    unique: true,
  },

  description: {
    type: String,
    required: true,
  },

  price: {
    type: String,
    required: true,
  },
});

const Violation = mongoose.model("Violation", violationShema);
export default Violation;
