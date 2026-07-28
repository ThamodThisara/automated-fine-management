import Complain from "../model/complain.model.js";
import { errorHandler } from "../utils/error.js";
import { COMPLAINTS_URL } from "../middleware/upload.js";

export const complainCreate = async (req, res, next) => {
  const { name, phoneNumber, email, complain } = req.body;
  // Multer stored the uploaded evidence image locally; save only its served path.
  // When no file is sent, leave it unset so the schema's default image applies.
  const image = req.file ? `${COMPLAINTS_URL}/${req.file.filename}` : undefined;

  const now = new Date();
  const offsetDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  const date = offsetDate.toISOString().split("T")[0];

  if (
    !name ||
    !phoneNumber ||
    !email ||
    !complain ||
    name == "" ||
    phoneNumber == "" ||
    email == "" ||
    complain == ""
  ) {
    return next(errorHandler(400, "All fields are required."));
  }

  try {
    const createComplain = Complain({
      name,
      phoneNumber,
      email,
      complain,
      date,
      image,
    });
    await createComplain.save();
    res.json("Complain submitted.");
  } catch (error) {
    next(error);
  }
};

export const getAllComplains = async (req, res, next) => {
  try {
    const complains = await Complain.find();
    res.status(200).json(complains);
  } catch (error) {
    next(error);
  }
};
