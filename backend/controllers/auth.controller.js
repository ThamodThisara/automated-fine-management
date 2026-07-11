import User from "../model/user.model.js";
import bcrpyt from "bcryptjs";
import { errorHandler } from "../utils/error.js";

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
        next(errorHandler(400, "All fields are required"));
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
        next(errorHandler(400, "All fields are required"));
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
        next(errorHandler(400, "All fields are required"));
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
    const user = await User.findOne({
      ...(req.body.email && { email: req.body.email }),
      ...(req.body.id && { id: req.body.id }),
    });
    if (!user) {
      return next(errorHandler(404, "User can not found."));
    }
    const checkPass = bcrpyt.compareSync(password, user.password);
    if (!checkPass) {
      return next(errorHandler(400, "User can not found."));
    }
    const { password: pass, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
