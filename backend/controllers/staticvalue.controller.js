import StaticValue from "../model/static.value.model.js";

export const getValue = async (req, res) => {
  const key = req.params.key;
  if (!key) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide a key" });
  }
  const value = await StaticValue.findOne({ key });
  if (!value) {
    return res.status(404).json({ success: false, message: "value not found" });
  }
  res.status(200).json({
    success: true,
    message: "Value fetched successfully",
    data: value,
  });
};
