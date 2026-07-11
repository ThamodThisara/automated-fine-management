import Vehicle from "../model/vehicle.model.js";
import { errorHandler } from "../utils/error.js";

export const vehicleCreate = async (req, res, next) => {
  const { no, cNumber, dateBrought, name, nic, phoneNumber, email, model } =
    req.body;

  if (
    !no ||
    !cNumber ||
    !dateBrought ||
    !name ||
    !nic ||
    !phoneNumber ||
    !email ||
    !model ||
    no == "" ||
    cNumber == "" ||
    dateBrought == "" ||
    name == "" ||
    nic == "" ||
    phoneNumber == "" ||
    email == "" ||
    model == ""
  ) {
    return next(errorHandler(400, "All fields are required"));
  }

  try {
    const createVehicle = Vehicle({
      no,
      cNumber,
      dateBrought: new Date(dateBrought),
      name,
      nic,
      phoneNumber,
      email,
      model,
    });
    await createVehicle.save();
    res.json("Vehicle registration is successfull");
  } catch (error) {
    next(error);
  }
};

export const vehicleUpdate = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findOne({ cNumber: req.params.cNumber });

    if (req.body.no) {
      if (vehicle.no !== req.body.no) {
        const existNumber = await Vehicle.findOne({ no: req.body.no });
        if (existNumber) {
          return next(errorHandler(409, "Vehicle Number is already exist"));
        }
      }
    }

    if (req.body.cNumber) {
      if (vehicle.cNumber !== req.body.cNumber) {
        const existChassie = await Vehicle.findOne({
          cNumber: req.body.cNumber,
        });
        if (existChassie) {
          return next(
            errorHandler(409, "Vehicle Chassie Number is already exist")
          );
        }
      }
    }

    const updateVehicle = await Vehicle.findByIdAndUpdate(
      vehicle._id,
      {
        $set: {
          no: req.body.no,
          cNumber: req.body.cNumber,
          dateBrought: req.body.dateBrought,
          name: req.body.name,
          nic: req.body.nic,
          phoneNumber: req.body.phoneNumber,
          email: req.body.email,
          model: req.body.model,
        },
      },
      { new: true }
    );
    res.status(200).json(updateVehicle);
  } catch (error) {
    next(error);
  }
};

export const getVehicle = async (req, res, next) => {
  try {
    const userId = req.params.cNumber;

    const vehicle = await Vehicle.findOne({ cNumber: userId });

    if (vehicle) {
      res.status(200).json(vehicle);
    } else {
      return next(404, "Vehicle not found");
    }
  } catch (error) {
    next(error);
  }
};

export const getAllVehicles = async (req, res, next) => {
  try {
    const vehicles = await Vehicle.find();
    if (vehicles) {
      res.status(200).json(vehicles);
    } else {
      return next(400, "Vehicle not found");
    }
  } catch (error) {
    next(error);
  }
};

export const deleteVehicle = async (req, res, next) => {
  try {
    const user = await Vehicle.findById(req.params.id);
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }
    await Vehicle.findByIdAndDelete(req.params.id);
    res.status(200).json("User delete is completed");
  } catch (error) {
    next(error);
  }
};
