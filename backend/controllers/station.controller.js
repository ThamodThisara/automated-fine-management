import Station from "../model/station.model.js";
import { errorHandler } from "../utils/error.js";

export const createStation = async (req, res, next) => {
  const { station, email, phone } = req.body;

  if (
    !station ||
    !email ||
    !phone ||
    station == "" ||
    email == "" ||
    phone == ""
  ) {
    return next(errorHandler(400, "All fields are required"));
  }

  try {
    const existStation = await Station.findOne({ station });
    if (existStation) {
      return next(errorHandler(409, "Station already exists"));
    }

    const newStation = Station({ station, email, phone });
    await newStation.save();
    return res.status(201).json(newStation);
  } catch (error) {
    next(error);
  }
};

// Public: used by station dropdowns across the app.
export const getAllStations = async (req, res, next) => {
  try {
    const stations = await Station.find();
    return res.status(200).json(stations);
  } catch (error) {
    next(error);
  }
};

export const getStation = async (req, res, next) => {
  try {
    const station = await Station.findById(req.params._id);
    if (!station) {
      return next(errorHandler(404, "Station not found"));
    }
    return res.status(200).json(station);
  } catch (error) {
    next(error);
  }
};

export const updateStation = async (req, res, next) => {
  try {
    const station = await Station.findById(req.params._id);
    if (!station) {
      return next(errorHandler(404, "Station not found"));
    }

    if (req.body.station && req.body.station !== station.station) {
      const existStation = await Station.findOne({
        station: req.body.station,
      });
      if (existStation) {
        return next(errorHandler(409, "Station already exists"));
      }
    }

    const updatedStation = await Station.findByIdAndUpdate(
      station._id,
      { $set: { ...req.body } },
      { new: true }
    );
    return res.status(200).json(updatedStation);
  } catch (error) {
    next(error);
  }
};

export const deleteStation = async (req, res, next) => {
  try {
    const station = await Station.findByIdAndDelete(req.params._id);
    if (!station) {
      return next(errorHandler(404, "Station not found"));
    }
    return res.status(200).json("Station delete is completed");
  } catch (error) {
    next(error);
  }
};
