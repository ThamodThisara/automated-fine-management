import User from "../model/user.model.js";
import bcrpyt from "bcryptjs";
import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error.js";

// Signs a JWT for the given user and sets it as an HttpOnly cookie.
const setAuthCookie = (res, user) => {
  const token = jwt.sign(
    { _id: user._id, id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
  res.cookie("access_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });
};

export const signup = async (req, res, next) => {
  const { name, password, nic, dob, address, phoneNumber, email, role, id } =
    req.body;

  if (
    !name ||
    !password ||
    !nic ||
    !dob ||
    !address ||
    !phoneNumber ||
    !email ||
    !role ||
    !id ||
    name == "" ||
    password == "" ||
    nic == "" ||
    dob == "" ||
    address == "" ||
    phoneNumber == "" ||
    email == "" ||
    role == "" ||
    id == ""
  ) {
    return next(errorHandler(400, "All fields are required"));
  }

  const bcrpytPassword = bcrpyt.hashSync(password, 9);

  if (role === "admin") {
    try {
      const { pStation, profilePicture } = req.body;
      if (!pStation || pStation == "") {
        return next(errorHandler(400, "All fields are required"));
      }
      const createUser = User({
        name,
        password: bcrpytPassword,
        id,
        nic,
        dob: new Date(dob),
        address,
        phoneNumber,
        email,
        role,
        pStation,
        profilePicture,
      });
      await createUser.save();
      res.json("Signup is successfull");
    } catch (error) {
      next(error);
    }
  } else if (role === "officer") {
    try {
      const { pStation, profilePicture } = req.body;
      if (!pStation || pStation == "") {
        return next(errorHandler(400, "All fields are required"));
      }

      const createUser = User({
        name,
        password: bcrpytPassword,
        id,
        nic,
        dob: new Date(dob),
        address,
        phoneNumber,
        email,
        role,
        pStation,
        profilePicture,
      });
      await createUser.save();
      res.json("Signup is successfull");
    } catch (error) {
      next(error);
    }
  } else if (role === "driver") {
    try {
      const { vType, model, profilePicture } = req.body;
      if (!vType || !model || vType == "" || model == "") {
        return next(errorHandler(400, "All fields are required"));
      }
      const createUser = User({
        name,
        password: bcrpytPassword,
        id,
        nic,
        dob: new Date(dob),
        address,
        phoneNumber,
        email,
        role,
        vType,
        model,
        profilePicture,
      });
      await createUser.save();
      res.json("Signup is successfull");
    } catch (error) {
      next(error);
    }
  }
};

export const login = async (req, res, next) => {
  const { password } = req.body;

  if (!password || password === "") {
    return next(errorHandler(400, "Fill all fields."));
  }
  try {
    let query = {};
    if (req.body.email) {
      query.email = req.body.email;
    }
    if (req.body.id) {
      query.id = req.body.id;
    }

    const user = await User.findOne(query);
    if (!user) {
      return next(errorHandler(404, "User can not found."));
    }
    const checkPass = bcrpyt.compareSync(password, user.password);
    if (!checkPass) {
      return next(errorHandler(400, "User can not found."));
    }
    const { password: pass, ...rest } = user._doc;
    setAuthCookie(res, user);
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

// Clears the auth cookie to log the user out.
export const logout = (req, res) => {
  res.clearCookie("access_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.status(200).json({ success: true, message: "Logged out successfully." });
};

// Returns the currently authenticated user (used to validate the session).
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return next(errorHandler(404, "User not found."));
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
