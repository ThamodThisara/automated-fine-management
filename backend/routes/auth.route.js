import express from "express";
import { login, signup, logout, getMe } from "../controllers/auth.controller.js";
import { verifyToken, verifyRole } from "../middleware/verifyToken.js";
import { profileUpload } from "../middleware/upload.js";

const router = express.Router();

// Only an authenticated admin may create new accounts.
// profileUpload parses the multipart form and stores any profile picture locally.
router.post(
  "/signup",
  verifyToken,
  verifyRole("admin"),
  profileUpload.single("profilePicture"),
  signup
);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", verifyToken, getMe);

export default router;
