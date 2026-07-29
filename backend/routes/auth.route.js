import express from "express";
import { login, signup, logout, getMe } from "../controllers/auth.controller.js";
import { verifyToken, verifyRole } from "../middleware/verifyToken.js";
import { profileUpload } from "../middleware/upload.js";

const router = express.Router();

// Admins may create any account; officers may register drivers only
// (enforced in the signup controller, since a role check alone can't
// distinguish "officer creating a driver" from "officer creating an officer").
// profileUpload parses the multipart form and stores any profile picture locally.
router.post(
  "/signup",
  verifyToken,
  verifyRole("admin", "officer"),
  profileUpload.single("profilePicture"),
  signup
);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", verifyToken, getMe);

export default router;
