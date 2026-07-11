import User from "../model/user.model.js";
import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/error.js";

export const userUpdate = async (req, res, next) => {
  if (req.body.password) {
    req.body.password = bcrypt.hashSync(req.body.password, 10);
  }

  try {
    const user = await User.findOne({ id: req.params.id });

    if (req.body.email) {
      if (user.email !== req.body.email) {
        const existEmail = await User.findOne({ email: req.body.email });
        if (existEmail) {
          return next(errorHandler(409, "Email is already exist"));
        }
      }
    }

    if (req.body.id) {
      if (user.id !== req.body.id) {
        const isId = await User.findOne({ id: req.body.id });
        if (isId) {
          return next(errorHandler(409, "Id is already exist"));
        }
      }
    }

    if (user.role === "officer" || user.role === "admin") {
      const userUpdate = await User.findByIdAndUpdate(
        user._id,
        {
          $set: {
            name: req.body.name,
            password: req.body.password,
            nic: req.body.nic,
            dob: req.body.dob,
            address: req.body.address,
            phoneNumber: req.body.phoneNumber,
            email: req.body.email,
            id: req.body.id,
            profilePicture: req.body.profilePicture,
            pStation: req.body.pStation,
          },
        },
        { new: true }
      );
      const { password: pass, ...rest } = userUpdate._doc;
      res.status(200).json(rest);
    } else if (user.role === "driver") {
      const userUpdate = await User.findByIdAndUpdate(
        user._id,
        {
          $set: {
            name: req.body.name,
            password: req.body.password,
            nic: req.body.nic,
            dob: req.body.dob,
            address: req.body.address,
            phoneNumber: req.body.phoneNumber,
            email: req.body.email,
            id: req.body.id,
            profilePicture: req.body.profilePicture,
            vType: req.body.vType,
            model: req.body.model,
          },
        },
        { new: true }
      );
      const { password: pass, ...rest } = userUpdate._doc;
      res.status(200).json(rest);
    }
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const userId = req.params.id;

    const user = await User.findOne({ id: userId });

    if (user.role === "driver")
      if (user) {
        res.status(200).json(user);
      } else {
        return next(404, "User not found");
      }
    else {
      console.log("This user can't find.");
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
        return next(404, "User not found");
      }
    else {
      console.log("This user can't find.");
    }
  } catch (error) {
    next(error);
  }
};
export const getAdmin = async (req, res, next) => {
  try {
    const userId = req.params.id;

    const user = await User.findOne({ id: userId });

    if (user.role === "admin")
      if (user) {
        res.status(200).json(user);
      } else {
        return next(404, "User not found");
      }
    else {
      console.log("This user can't find.");
    }
  } catch (error) {
    next(error);
  }
};

export const getAllOfficers = async (req, res, next) => {
  try {
    const officers = await User.find({ role: "officer" });
    if (officers) {
      res.status(200).json(officers);
    } else {
      return next(400, "User not found");
    }
  } catch (error) {
    next(error);
  }
};
export const getAllAdmins = async (req, res, next) => {
  try {
    const admins = await User.find({ role: "admin" });
    if (admins) {
      res.status(200).json(admins);
    } else {
      return next(400, "User not found");
    }
  } catch (error) {
    next(error);
  }
};

export const getAllDrivers = async (req, res, next) => {
  try {
    const drivers = await User.find({ role: "driver" });
    if (drivers) {
      res.status(200).json(drivers);
    } else {
      return next(400, "User not found");
    }
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
