import express from "express";
import {
  createStation,
  getAllStations,
  getStation,
  updateStation,
  deleteStation,
} from "../controllers/station.controller.js";
import { verifyToken, verifyRole } from "../middleware/verifyToken.js";

const router = express.Router();

// Public read: station list used by dropdowns across the app.
router.get("/getall", getAllStations);

// Managing stations: admins only.
router.post("/add", verifyToken, verifyRole("admin"), createStation);
router.put("/update/:_id", verifyToken, verifyRole("admin"), updateStation);
router.delete("/delete/:_id", verifyToken, verifyRole("admin"), deleteStation);
router.get("/get/:_id", verifyToken, verifyRole("admin"), getStation);

export default router;
