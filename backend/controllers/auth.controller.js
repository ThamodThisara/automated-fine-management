import User from "../model/user.model.js";
import bcrpyt from "bcryptjs";
import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error.js";
import {
  isValidPassword,
  normalizeNic,
  VALIDATION_MESSAGES,
} from "../utils/validators.js";
import { PROFILES_URL } from "../middleware/upload.js";

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
    name == "" ||
    password == "" ||
    nic == "" ||
    dob == "" ||
    address == "" ||
    phoneNumber == "" ||
    email == "" ||
    role == ""
  ) {
    return next(errorHandler(400, "All fields are required"));
  }

  // Password strength is validated on the plaintext here, before it is hashed —
  // a schema validator would only ever see the bcrypt hash.
  if (!isValidPassword(password)) {
    return next(errorHandler(400, VALIDATION_MESSAGES.password));
  }

  const bcrpytPassword = bcrpyt.hashSync(password, 9);

  // Common fields shared by every role. Only officers keep a human-readable id
  // (their official police number); drivers and admins are identified by their _id.
  // NIC is normalized to its canonical uppercase form; nic/phone/email formats are
  // enforced by the schema's match validators.
  const baseUser = {
    name,
    password: bcrpytPassword,
    nic: normalizeNic(nic),
    dob: new Date(dob),
    address,
    phoneNumber,
    email,
    role,
    // Multer stored the uploaded picture locally; save only its served path.
    // When no file is sent, leave it unset so the schema's default avatar applies.
    profilePicture: req.file ? `${PROFILES_URL}/${req.file.filename}` : undefined,
  };

  if (role === "admin") {
    try {
      const { pStation } = req.body;
      if (!pStation || pStation == "") {
        return next(errorHandler(400, "All fields are required"));
      }
      const createUser = User({ ...baseUser, pStation });
      await createUser.save();
      res.json("Signup is successfull");
    } catch (error) {
      next(error);
    }
  } else if (role === "officer") {
    try {
      const { pStation } = req.body;
      if (!pStation || pStation == "" || !id || id == "") {
        return next(errorHandler(400, "All fields are required"));
      }

      const createUser = User({ ...baseUser, id, pStation });
      await createUser.save();
      res.json("Signup is successfull");
    } catch (error) {
      next(error);
    }
  } else if (role === "driver") {
    try {
      const { vType, model } = req.body;
      if (!vType || !model || vType == "" || model == "") {
        return next(errorHandler(400, "All fields are required"));
      }
      const createUser = User({ ...baseUser, vType, model });
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
