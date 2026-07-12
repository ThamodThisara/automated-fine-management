import express from "express";
import { login, signup, logout, getMe } from "../controllers/auth.controller.js";
import { verifyToken, verifyRole } from "../middleware/verifyToken.js";

const router = express.Router();

// Only an authenticated admin may create new accounts.
router.post("/signup", verifyToken, verifyRole("admin"), signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", verifyToken, getMe);

export default router;
