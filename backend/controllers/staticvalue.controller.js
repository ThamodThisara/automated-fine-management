import StaticValue from "../model/static.value.model.js";
import { errorHandler } from "../utils/error.js";

export const getValue = async (req, res, next) => {
  const key = req.params.key;
  if (!key) {
    return next(errorHandler(400, "Please provide a key"));
  }
  try {
    const value = await StaticValue.findOne({ key });
    if (!value) {
      return next(errorHandler(404, "value not found"));
    }
    res.status(200).json({
      success: true,
      message: "Value fetched successfully",
      data: value,
    });
  } catch (error) {
    next(error);
  }
};
