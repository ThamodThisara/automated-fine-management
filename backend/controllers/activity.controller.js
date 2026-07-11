import Activity from "../model/activity.model.js";
import { errorHandler } from "../utils/error.js";

export const addActivity = async (req, res, next) => {
  try {
    const { action, createdBy } = req.body;
    const activity = new Activity({ action, createdBy });
    await activity.save();
    res.status(201).json({ success: true, activity });
  } catch (error) {
    next(error);
  }
};

export const getRecentActivities = async (req, res, next) => {
  try {
    const activities = await Activity.find({ createdBy: req.params.aId })
      .sort({ createdAt: -1 })
      .limit(6);
    if (activities) {
      res.status(200).json(activities);
    } else {
      return next(400, "Activities not found");
    }
  } catch (error) {
    next(error);
  }
};

export const addActivityOfficer = async (req, res, next) => {
  try {
    const { action, createdBy } = req.body;
    const activity = new Activity({ action, createdBy });
    await activity.save();
    res.status(201).json({ success: true, activity });
  } catch (error) {
    next(error);
  }
};

export const getRecentActivitiesOfficer = async (req, res, next) => {
  try {
    const activities = await Activity.find({ createdBy: req.params.oId })
      .sort({ createdAt: -1 })
      .limit(6);
    if (activities) {
      res.status(200).json(activities);
    } else {
      return next(400, "Activities not found");
    }
  } catch (error) {
    next(error);
  }
};
