import express from "express";
import {
  getAllDrivers,
  getAllOfficers,
  getUser,
  getOfficer,
  userUpdate,
  deleteDriver,
  deleteOfficer,
  getAdmin,
  getAllAdmins,
  deleteAdmin,
} from "../controllers/user.controller.js";
import { verifyToken, verifyRole } from "../middleware/verifyToken.js";

const router = express.Router();

// Reads: any authenticated user (e.g. drivers view their own profile).
// Drivers and admins are looked up by NIC; officers keep their human-readable id.
router.get("/getuser/:nic", verifyToken, getUser);
router.get("/getofficer/:id", verifyToken, getOfficer);
router.get("/getadmin/:nic", verifyToken, getAdmin);
router.put("/update/:userId", verifyToken, userUpdate);
router.get("/getallofficers", verifyToken, getAllOfficers);
router.get("/getalldrivers", verifyToken, getAllDrivers);

// Account management: admins only.
router.get("/getalladmins", verifyToken, verifyRole("admin"), getAllAdmins);
router.delete("/delete-officer/:id", verifyToken, verifyRole("admin"), deleteOfficer);
router.delete("/delete-admin/:id", verifyToken, verifyRole("admin"), deleteAdmin);
router.delete("/delete-driver/:id", verifyToken, verifyRole("admin"), deleteDriver);

export default router;
