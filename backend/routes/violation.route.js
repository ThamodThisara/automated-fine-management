import express from "express";
import {
  ruleCreate,
  getAllRule,
  getRule,
  violationUpdate,
  deleteViolation,
  getRuleBySearch,
} from "../controllers/violation.controller.js";
import { verifyToken, verifyRole } from "../middleware/verifyToken.js";

const router = express.Router();

// Managing violation types: admins only.
router.post("/add", verifyToken, verifyRole("admin"), ruleCreate);
router.put("/update/:_id", verifyToken, verifyRole("admin"), violationUpdate);
router.delete("/delete/:_id", verifyToken, verifyRole("admin"), deleteViolation);

// Authenticated reads (used when issuing fines and browsing rules).
router.get("/getallrules", verifyToken, getAllRule);
router.get("/getrule/:_id", verifyToken, getRule);
router.get("/search", verifyToken, getRuleBySearch);

export default router;
