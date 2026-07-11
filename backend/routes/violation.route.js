import express from "express";
import {
  ruleCreate,
  getAllRule,
  getRule,
  violaionUpdate,
  deleteViolation,
  getRuleBySearch,
} from "../controllers/violation.controller.js";

const router = express.Router();

router.post("/add", ruleCreate);
router.get("/getallrules", getAllRule);
router.get("/getrule/:_id", getRule);
router.put("/update/:_id", violaionUpdate);
router.delete("/delete/:_id", deleteViolation);
router.get("/search", getRuleBySearch);

export default router;
