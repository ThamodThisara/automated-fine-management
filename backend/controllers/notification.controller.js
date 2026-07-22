import Notification from "../model/notification.model.js";

export const getLatestNotifications = async (req, res, next) => {
  try {
    // Fetch latest 5 notifications, sorted by createdAt (newest first)
    const notifications = await Notification.find()
      .sort({ createdAt: -1 }) // Sort by newest first
      .limit(5) // Limit to 5 results
      .populate("fineId"); // Optional: Populate the 'fineId' ref if needed

    res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications,
    });
  } catch (error) {
    next(error);
  }
};