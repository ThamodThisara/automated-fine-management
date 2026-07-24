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
    const vehicle = await Vehicle.findOne({
      cNumber: req.params.cNumber
    });

    if (!vehicle) {
      return next(errorHandler(404, "Vehicle not found"));
    }

    if (req.body.no && req.body.no !== vehicle.no) {
      const existNumber = await Vehicle.findOne({
        no: req.body.no
      });

      if (existNumber) {
        return next(
            errorHandler(409, "Vehicle Number already exists")
        );
      }
    }

    if (req.body.cNumber && req.body.cNumber !== vehicle.cNumber) {
      const existChassis = await Vehicle.findOne({
        cNumber: req.body.cNumber
      });

      if (existChassis) {
        return next(
            errorHandler(409, "Vehicle Chassis Number already exists")
        );
      }
    }

    const updateVehicle = await Vehicle.findByIdAndUpdate(
        vehicle._id,
        {
          $set:{
            ...req.body
          }
          // Without Spread
          // ""
          // $set: {
          //   no: req.body.no,
          //   cNumber: req.body.cNumber,
          //   dateBrought: req.body.dateBrought,
          //   name: req.body.name,
          //   nic: req.body.nic,
          //   phoneNumber: req.body.phoneNumber,
          //   email: req.body.email,
          //   model: req.body.model,
          // }
          // ""
        },
        {new:true}
    );
    return res.status(200).json(updateVehicle);
  } catch(error){
    next(error);
  }
};

export const getVehicle = async (req, res, next) => {
  try {
    const chassisNumber = req.params.cNumber;
    const vehicle = await Vehicle.findOne({ cNumber: chassisNumber });

    if (!vehicle) {
      return next(errorHandler(404, "Vehicle not found"));
    }

    return res.status(200).json(vehicle);
  } catch (error) {
    next(error);
  }
};

export const getAllVehicles = async (req, res, next) => {
  try {
    const vehicles = await Vehicle.find();
    return res.status(200).json(vehicles);
  } catch (error) {
    next(error);
  }
};

export const deleteVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
    if(!vehicle){
      return next(errorHandler(404,"Vehicle not found"));
    }
    return res.status(200).json("Vehicle delete is completed" );
  } catch(error){
    next(error);
  }
};
