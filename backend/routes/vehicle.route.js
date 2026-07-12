import express from "express";
import {
  vehicleCreate,
  getVehicle,
  vehicleUpdate,
  getAllVehicles,
  deleteVehicle,
} from "../controllers/vehicle.controller.js";
import { verifyToken, verifyRole } from "../middleware/verifyToken.js";

const router = express.Router();

// Mutations: officers/admins only.
router.post("/create", verifyToken, verifyRole("admin", "officer"), vehicleCreate);
router.put("/updatevehicle/:cNumber", verifyToken, verifyRole("admin", "officer"), vehicleUpdate);
router.delete("/delete/:id", verifyToken, verifyRole("admin", "officer"), deleteVehicle);

// Authenticated reads.
router.get("/getvehicle/:cNumber", verifyToken, getVehicle);
router.get("/getallvehicles", verifyToken, getAllVehicles);

export default router;
