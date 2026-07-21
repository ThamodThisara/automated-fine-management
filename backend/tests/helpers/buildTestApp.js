// Builds an Express app that mirrors the middleware, routes and error handler wired in
// backend/index.js, WITHOUT importing socket.io, connecting to MongoDB, scheduling the cron
// job, or calling server.listen(). This lets Supertest drive the real routers/middleware
// while leaving production code untouched.
//
// MAINTENANCE: if routes or global middleware change in index.js, mirror the change here.

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "../../routes/auth.route.js";
import userRoutes from "../../routes/user.route.js";
import vehicleRoutes from "../../routes/vehicle.route.js";
import fineRoutes from "../../routes/fine.route.js";
import messageRoutes from "../../routes/message.route.js";
import violatioRoute from "../../routes/violation.route.js";
import complainRoutes from "../../routes/complain.route.js";
import stativRoutes from "../../routes/staticvalue.route.js";
import notificationRoutes from "../../routes/notification.route.js";
import activityRoutes from "../../routes/activity.route.js";
import payRoutes from "../../routes/payment.route.js";

export const buildTestApp = () => {
  const app = express();

  app.use(express.json());
  app.use(cookieParser());
  app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    })
  );

  app.use("/api/v1/auth", authRoutes);
  app.use("/api/v1/user", userRoutes);
  app.use("/api/v1/vehicle", vehicleRoutes);
  app.use("/api/v1/fine", fineRoutes);
  app.use("/api/v1/message", messageRoutes);
  app.use("/api/v1/violation", violatioRoute);
  app.use("/api/pay", payRoutes);
  app.use("/api/v1/complain", complainRoutes);
  app.use("/api/v1/static", stativRoutes);
  app.use("/api/v1/notification", notificationRoutes);
  app.use("/api/v1/activity", activityRoutes);

  // Same error-handling middleware as index.js.
  app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal server error";
    res.status(statusCode).json({ success: false, statusCode, message });
  });

  return app;
};
