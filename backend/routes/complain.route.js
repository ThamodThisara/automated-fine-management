import express from "express";
import {
  complainCreate,
  getAllComplains,
} from "../controllers/complain.controller.js";
import { verifyToken, verifyRole } from "../middleware/verifyToken.js";
import { complaintUpload } from "../middleware/upload.js";

const router = express.Router();

// Public: anyone may submit a complaint from the Contact page.
// complaintUpload parses the multipart form and stores any evidence image locally.
router.post("/complainadd", complaintUpload.single("image"), complainCreate);

// Viewing all complaints is restricted to admins.
router.get("/all", verifyToken, verifyRole("admin"), getAllComplains);

export default router;
