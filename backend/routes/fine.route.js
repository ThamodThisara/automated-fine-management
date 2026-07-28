import express from "express";
import {
  fineIssue,
  fineUpdate,
  generateFinePDF,
  getAllFines,
  getBlockFine,
  getBlockFines,
  getFine,
  getFineByNic,
  getFineByOid,
  getFineOfficer,
  getUnpaidFine,
  getblockdriverFine,
} from "../controllers/fine.controller.js";
import { verifyToken, verifyRole } from "../middleware/verifyToken.js";

const router = express.Router();

// Public: fine search page and the (Stripe) payment flow.
router.get("/getallfine", getAllFines);
router.get("/getfinebyobjectid/:_id", getFineByOid);

// Officers/admins issue and resolve fines.
router.post("/fineissue", verifyToken, verifyRole("admin", "officer"), fineIssue);
router.put("/updateblockfines/:_id", verifyToken, verifyRole("admin", "officer"), fineUpdate);

// Authenticated reads.
router.get("/getfine/:driverId", verifyToken, getFine);
router.get("/getfinebynic/:nic", verifyToken, getFineByNic);
router.get("/getblockfines", verifyToken, getBlockFines);
router.get("/getblockfine/:_id", verifyToken, getBlockFine);
router.get("/pdf", verifyToken, generateFinePDF);
router.get("/getfineofficer/:pId", verifyToken, getFineOfficer);
router.get("/getunpaidfine/:driverId", verifyToken, getUnpaidFine);
router.get("/getblockdriverfine/:driverId", verifyToken, getblockdriverFine);

export default router;
