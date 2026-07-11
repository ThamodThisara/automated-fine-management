import mongoose from "mongoose";

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
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    id: {
      type: String,
      required: true,
      unique: true,
    },

    profilePicture: {
      type: String,
      default:
        "https://static.vecteezy.com/system/resources/thumbnails/002/318/271/small/user-profile-icon-free-vector.jpg",
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
