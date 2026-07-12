import express from "express";
import { getGroup, sendMessage } from "../controllers/message.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Group messaging is restricted to authenticated users.
router.get("/getgroup/:id/:station", verifyToken, getGroup);
router.post("/send/:id/:station", verifyToken, sendMessage);

export default router;
