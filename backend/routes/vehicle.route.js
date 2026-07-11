import express from "express";
import {
  vehicleCreate,
  getVehicle,
  vehicleUpdate,
  getAllVehicles,
  deleteVehicle,
} from "../controllers/vehicle.controller.js";

const router = express.Router();

router.post("/create", vehicleCreate);
router.get("/getvehicle/:cNumber", getVehicle);
router.put("/updatevehicle/:cNumber", vehicleUpdate);
router.get("/getallvehicles", getAllVehicles);
router.delete("/delete/:id", deleteVehicle);

export default router;
