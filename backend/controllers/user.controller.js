import User from "../model/user.model.js";
import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import {
  isValidPassword,
  normalizeNic,
  VALIDATION_MESSAGES,
} from "../utils/validators.js";
import { PROFILES_URL } from "../middleware/upload.js";

export const userUpdate = async (req, res, next) => {
  // Password is optional on update (blank = keep current). Only validate/hash it
  // when a new one was actually supplied — and validate the plaintext before hashing.
  if (req.body.password) {
    if (!isValidPassword(req.body.password)) {
      return next(errorHandler(400, VALIDATION_MESSAGES.password));
    }
    req.body.password = bcrypt.hashSync(req.body.password, 10);
  }

  // Normalize NIC to its canonical uppercase form before it hits the schema validators.
  if (req.body.nic) {
    req.body.nic = normalizeNic(req.body.nic);
  }

  try {
    // Every user is now updated by their MongoDB _id, so this works for all roles
    // regardless of whether they carry a human-readable id.
    const user = await User.findById(req.params.userId);
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    if (req.body.email) {
      if (user.email !== req.body.email) {
        const existEmail = await User.findOne({ email: req.body.email });
        if (existEmail) {
          return next(errorHandler(409, "Email is already exist"));
        }
      }
    }

    // Only officers have an editable human-readable id; keep it unique when changed.
    if (user.role === "officer" && req.body.id && user.id !== req.body.id) {
      const isId = await User.findOne({ id: req.body.id });
      if (isId) {
        return next(errorHandler(409, "Id is already exist"));
      }
    }

    const commonFields = {
      name: req.body.name,
      password: req.body.password,
      nic: req.body.nic,
      dob: req.body.dob,
      address: req.body.address,
      phoneNumber: req.body.phoneNumber,
      email: req.body.email,
      // A new upload replaces the picture; with no file the field stays undefined so
      // Mongoose leaves the existing profilePicture untouched.
      profilePicture: req.file
        ? `${PROFILES_URL}/${req.file.filename}`
        : undefined,
    };

    let updateFields;
    if (user.role === "officer") {
      updateFields = {
        ...commonFields,
        id: req.body.id,
        pStation: req.body.pStation,
      };
    } else if (user.role === "admin") {
      updateFields = { ...commonFields, pStation: req.body.pStation };
    } else {
      updateFields = {
        ...commonFields,
        vType: req.body.vType,
        model: req.body.model,
      };
    }

    const updated = await User.findByIdAndUpdate(
      user._id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );
    const { password: pass, ...rest } = updated._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

// Drivers no longer carry a human-readable id, so they are looked up by NIC
// (used by the fine-issue form and the driver-management screens).
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ nic: req.params.nic, role: "driver" });

    if (user) {
      res.status(200).json(user);
    } else {
      return next(errorHandler(404, "User not found"));
    }
  } catch (error) {
    next(error);
  }
};

export const getOfficer = async (req, res, next) => {
  try {
    const userId = req.params.id;

    const user = await User.findOne({ id: userId });

    if (user.role === "officer")
      if (user) {
        res.status(200).json(user);
      } else {
        return next(errorHandler(404, "User not found"));
      }
    else {
      console.log("This user can't find.");
    }
  } catch (error) {
    next(error);
  }
};
// Admins no longer carry a human-readable id, so they are looked up by NIC
// (used by the admin update/delete management screens).
export const getAdmin = async (req, res, next) => {
  try {
    const user = await User.findOne({ nic: req.params.nic, role: "admin" });

    if (user) {
      res.status(200).json(user);
    } else {
      return next(errorHandler(404, "User not found"));
    }
  } catch (error) {
    next(error);
  }
};

export const getAllOfficers = async (req, res, next) => {
  try {
    const officers = await User.find({ role: "officer" });
    res.status(200).json(officers);
  } catch (error) {
    next(error);
  }
};
export const getAllAdmins = async (req, res, next) => {
  try {
    const admins = await User.find({ role: "admin" });
    res.status(200).json(admins);
  } catch (error) {
    next(error);
  }
};

export const getAllDrivers = async (req, res, next) => {
  try {
    const drivers = await User.find({ role: "driver" });
    res.status(200).json(drivers);
  } catch (error) {
    next(error);
  }
};

export const deleteOfficer = async (req, res, next) => {
  try {
    console.log(req.params.id);
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }
    if (user.role === "officer") {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("User delete is completed");
    } else {
      return next(errorHandler(401, "you can't delete"));
    }
  } catch (error) {
    next(error);
  }
};
export const deleteAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }
    if (user.role === "admin") {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("User delete is completed");
    } else {
      return next(errorHandler(401, "you can't delete"));
    }
  } catch (error) {
    next(error);
  }
};
export const deleteDriver = async (req, res, next) => {
  try {
    console.log(req.params.id);
    const user = await User.findById(req.params.id);
    console.log(user);
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }
    if (user.role === "driver") {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("User delete is completed");
    } else {
      return next(errorHandler(401, "you can't delete"));
    }
  } catch (error) {
    next(error);
  }
};
