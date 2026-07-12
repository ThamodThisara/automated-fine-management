import express from "express";
import {
  complainCreate,
  getAllComplains,
} from "../controllers/complain.controller.js";
import { verifyToken, verifyRole } from "../middleware/verifyToken.js";

const router = express.Router();

// Public: anyone may submit a complaint from the Contact page.
router.post("/complainadd", complainCreate);

// Viewing all complaints is restricted to admins.
router.get("/all", verifyToken, verifyRole("admin"), getAllComplains);

export default router;
