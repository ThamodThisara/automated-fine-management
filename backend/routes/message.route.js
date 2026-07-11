import express from "express";
import { getGroup, sendMessage } from "../controllers/message.controller.js";

const router = express.Router();

router.get("/getgroup/:id/:station", getGroup);
router.post("/send/:id/:station", sendMessage);

export default router;
