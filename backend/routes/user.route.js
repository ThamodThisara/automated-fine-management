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
router.get("/getuser/:id", verifyToken, getUser);
router.get("/getofficer/:id", verifyToken, getOfficer);
router.get("/getadmin/:id", verifyToken, getAdmin);
router.put("/update/:id", verifyToken, userUpdate);
router.get("/getallofficers", verifyToken, getAllOfficers);
router.get("/getalldrivers", verifyToken, getAllDrivers);

// Account management: admins only.
router.get("/getalladmins", verifyToken, verifyRole("admin"), getAllAdmins);
router.delete("/delete-officer/:id", verifyToken, verifyRole("admin"), deleteOfficer);
router.delete("/delete-admin/:id", verifyToken, verifyRole("admin"), deleteAdmin);
router.delete("/delete-driver/:id", verifyToken, verifyRole("admin"), deleteDriver);

export default router;
