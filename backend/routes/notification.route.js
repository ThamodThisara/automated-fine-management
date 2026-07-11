import express from "express";
import { getLatestNotifications } from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/latest", getLatestNotifications);

export default router;