// routes/activityRoutes.js
import express from "express";
import {
  addActivity,
  getRecentActivities,
  addActivityOfficer,
  getRecentActivitiesOfficer,
} from "../controllers/activity.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Activity logs are only available to authenticated users (dashboards).
router.post("/add", verifyToken, addActivity);
router.get("/recent/:aId", verifyToken, getRecentActivities);
router.post("/addOfficer", verifyToken, addActivityOfficer);
router.get("/recentOfficer/:oId", verifyToken, getRecentActivitiesOfficer);

export default router;
