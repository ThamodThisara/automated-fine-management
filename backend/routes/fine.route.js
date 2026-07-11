import express from "express";
import {
  fineIssue,
  fineUpdate,
  generateFinePDF,
  getAllFines,
  getBlockFine,
  getBlockFines,
  getFine,
  getFineByOid,
  getFineOfficer,
  getUnpaidFine,
  getblockdriverFine,
} from "../controllers/fine.controller.js";

const router = express.Router();

router.post("/fineissue", fineIssue);
router.get("/getallfine", getAllFines);
router.get("/getfine/:dId", getFine);
router.get("/getfinebyobjectid/:_id", getFineByOid);
router.get("/getblockfines", getBlockFines);
router.put("/updateblockfines/:_id", fineUpdate);
router.get("/getblockfine/:_id", getBlockFine);
router.get("/pdf", generateFinePDF);
router.get("/getfineofficer/:pId", getFineOfficer);
router.get("/getunpaidfine/:dId", getUnpaidFine);
router.get("/getblockdriverfine/:dId", getblockdriverFine);

export default router;
